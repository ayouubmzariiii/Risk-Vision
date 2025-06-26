import { GenerateMitigationParams, GenerateRiskParams, Risk, RiskCategory, MitigationStrategy, TeamMember } from '../types';

const API_KEY = "sk-0d3cbfcd7feb478ea7ef1398aaa6a1b7";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

interface DeepseekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const callDeepseekAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as DeepseekResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};

export const generateRisks = async (params: GenerateRiskParams): Promise<Partial<Risk>[]> => {
  const { 
    industry = 'general', 
    projectType = 'general', 
    categories = [], 
    count,
    country,
    budget,
    timeline,
    teamSize,
    stakeholders,
    regulations,
    teamMembers = []
  } = params;
  
  let categoriesText = '';
  if (categories.length > 0) {
    categoriesText = `Risk categories should be limited to the following: ${categories.join(', ')}.`;
  }

  let teamMembersText = '';
  if (teamMembers.length > 0) {
    teamMembersText = `
      Available Team Members:
      ${teamMembers.map(member => `
        - ${member.displayName} (${member.jobTitle})
          Role in project: ${member.projectRole || 'Not specified'}
      `).join('\n')}
      
      Consider team members' roles and expertise when assigning responsibilities and identifying risks.
    `;
  }

  const prompt = `
    Generate ${count ? `${count}` : 'comprehensive'} potential project risks for a ${projectType} project in the ${industry} industry.
    
    Project Context:
    - Country/Region: ${country || 'Not specified'}
    - Budget: ${budget || 'Not specified'}
    - Timeline: ${timeline || 'Not specified'}
    - Team Size: ${teamSize || 'Not specified'}
    - Key Stakeholders: ${stakeholders || 'Not specified'}
    - Regulatory Requirements: ${regulations || 'Not specified'}
    
    ${teamMembersText}
    ${categoriesText}
    
    Consider:
    1. Local regulations and compliance requirements
    2. Regional market conditions and challenges
    3. Industry-specific risks
    4. Cultural and business environment factors
    5. Economic and political stability
    6. Infrastructure and resource availability
    7. Team composition and expertise
    8. Resource allocation and team member availability
    
    IMPORTANT: Return a valid JSON array containing objects with the following structure. ALL property names MUST be enclosed in double quotes:
    [
      {
        "title": "Risk title here",
        "description": "Risk description here",
        "category": "Category name here",
        "probability": 5,
        "impact": 5,
        "assignedTo": "team.member@email.com",
        "potentialSolutions": ["Solution 1", "Solution 2"]
      }
    ]
    
    The response MUST be a properly formatted JSON array that can be parsed by JSON.parse().
  `;

  try {
    const response = await callDeepseekAPI(prompt);
    const jsonMatch = response.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from API response');
    }
    
    const jsonString = jsonMatch[0];
    const risks = JSON.parse(jsonString) as Partial<Risk>[];
    
    return risks.map(risk => ({
      ...risk,
      probability: Math.min(10, Math.max(1, risk.probability || 5)),
      impact: Math.min(10, Math.max(1, risk.impact || 5)),
      category: (risk.category as RiskCategory) || 'technical',
      assignedTo: risk.assignedTo && teamMembers.some(m => m.email === risk.assignedTo) 
        ? risk.assignedTo 
        : undefined
    }));
  } catch (error) {
    console.error('Error generating risks:', error);
    throw error;
  }
};

export const generateMitigationStrategy = async (params: GenerateMitigationParams): Promise<MitigationStrategy> => {
  const { risk, teamMembers = [] } = params;

  const teamMembersText = teamMembers.length > 0 
    ? `
      Available Team Members:
      ${teamMembers.map(member => `
        - ${member.displayName} (${member.jobTitle})
          Role in project: ${member.projectRole || 'Not specified'}
      `).join('\n')}
    `
    : '';

  const prompt = `
    Generate a detailed mitigation strategy for the following project risk:
    
    Risk Title: ${risk.title}
    Risk Description: ${risk.description}
    Risk Category: ${risk.category}
    Probability (1-10): ${risk.probability}
    Impact (1-10): ${risk.impact}
    Currently Assigned To: ${risk.assignedTo || 'Not assigned'}
    
    ${teamMembersText}
    
    Provide a comprehensive mitigation strategy in JSON format with the following structure:
    {
      "overview": "Brief overview of the strategy",
      "responsibleRoles": [
        {
          "role": "Role title (reference actual team members where applicable)",
          "responsibilities": ["List of specific responsibilities"]
        }
      ],
      "timeline": [
        {
          "phase": "Phase name",
          "duration": "Expected duration",
          "activities": ["List of activities"]
        }
      ],
      "resources": [
        {
          "type": "Resource type",
          "requirements": ["Specific requirements"]
        }
      ],
      "successMetrics": ["List of measurable success criteria"],
      "costImplications": [
        {
          "item": "Cost item",
          "estimate": "Estimated cost"
        }
      ],
      "implementationChallenges": ["List of potential challenges"]
    }
    
    The strategy should:
    1. Be practical and specific to the available team members
    2. Leverage team members' expertise and roles
    3. Include clear responsibilities and ownership
    4. Consider team capacity and availability
    5. Be actionable with the current team composition
  `;

  try {
    const response = await callDeepseekAPI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from API response');
    }
    
    return JSON.parse(jsonMatch[0]) as MitigationStrategy;
  } catch (error) {
    console.error('Error generating mitigation strategy:', error);
    throw error;
  }
};

export const generateSolutions = async (risk: Risk): Promise<string[]> => {
  const prompt = `
    Generate practical solutions for the following project risk:
    
    Risk Title: ${risk.title}
    Risk Description: ${risk.description}
    Risk Category: ${risk.category}
    Probability (1-10): ${risk.probability}
    Impact (1-10): ${risk.impact}
    
    Provide 3-5 detailed solutions that:
    1. Address the root cause
    2. Are practical to implement
    3. Consider resource constraints
    4. Include success criteria
    5. Account for potential challenges
    
    Format each solution as a complete paragraph with actionable steps.
    Return the solutions as a JSON array of strings.
  `;

  try {
    const response = await callDeepseekAPI(prompt);
    const jsonMatch = response.match(/\[\s*".*"\s*\]/s);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from API response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating solutions:', error);
    throw error;
  }
};