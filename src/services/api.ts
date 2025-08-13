import { GenerateMitigationParams, GenerateRiskParams, Risk, RiskCategory, MitigationStrategy, TeamMember, APIConfiguration, AIProvider } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Default RiskVision API configuration (using DeepSeek)
const DEFAULT_API_CONFIG: APIConfiguration = {
  provider: 'riskvision',
  apiKey: 'sk-0d3cbfcd7feb478ea7ef1398aaa6a1b7',
  model: 'deepseek-chat'
};

// API endpoints for different providers
const API_ENDPOINTS = {
  riskvision: 'https://api.deepseek.com/v1/chat/completions',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};

// Default models for each provider
const DEFAULT_MODELS = {
  riskvision: 'deepseek-chat',
  deepseek: 'deepseek-chat',
  openai: 'gpt-3.5-turbo',
  gemini: 'gemini-pro'
};

interface APIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Get user's API configuration
const getUserAPIConfig = async (userId?: string): Promise<APIConfiguration> => {
  if (!userId) {
    return DEFAULT_API_CONFIG;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.apiConfig) {
        return userData.apiConfig;
      }
    }
  } catch (error) {
    console.error('Error fetching user API config:', error);
  }

  return DEFAULT_API_CONFIG;
};

// Dynamic API call based on provider
const callAI = async (prompt: string, userId?: string): Promise<string> => {
  const config = await getUserAPIConfig(userId);
  const endpoint = API_ENDPOINTS[config.provider];
  const model = config.model || DEFAULT_MODELS[config.provider];

  try {
    if (config.provider === 'gemini') {
      return await callGeminiAPI(prompt, config.apiKey, model);
    } else {
      return await callOpenAICompatibleAPI(prompt, config.apiKey, endpoint, model);
    }
  } catch (error) {
    console.error(`Error calling ${config.provider} API:`, error);
    throw error;
  }
};

// OpenAI-compatible API call (works for OpenAI, DeepSeek, RiskVision)
const callOpenAICompatibleAPI = async (prompt: string, apiKey: string, endpoint: string, model: string): Promise<string> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
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

  const data = await response.json() as APIResponse;
  return data.choices[0].message.content;
};

// Gemini API call (different format)
const callGeminiAPI = async (prompt: string, apiKey: string, model: string): Promise<string> => {
  const response = await fetch(`${API_ENDPOINTS.gemini}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API request failed with status ${response.status}`);
  }

  const data = await response.json() as GeminiResponse;
  return data.candidates[0].content.parts[0].text;
};

export const generateRisks = async (params: GenerateRiskParams, userId?: string): Promise<Partial<Risk>[]> => {
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
    const response = await callAI(prompt, userId);
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

export const generateMitigationStrategy = async (params: GenerateMitigationParams, userId?: string): Promise<MitigationStrategy> => {
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
    const response = await callAI(prompt, userId);
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

export const fillFormWithAI = async (projectName: string, projectDescription: string, userId?: string): Promise<{
  industry: string;
  projectType: string;
  country: string;
  budget: string;
  timeline: string;
  teamSize: string;
  stakeholders: string;
  regulations: string;
}> => {
  const prompt = `
    Based on the following project information, please fill out a risk generation form with appropriate values:
    
    Project Name: ${projectName}
    Project Description: ${projectDescription}
    
    Please provide realistic and specific values for the following fields based on the project context:
    - Industry (e.g., Software, Construction, Healthcare)
    - Project Type (e.g., Mobile App, Building Construction)
    - Country/Region (infer from context or use a reasonable default)
    - Project Budget (provide a realistic estimate with currency)
    - Timeline (provide a realistic project duration)
    - Team Size (estimate based on project scope)
    - Key Stakeholders (identify likely stakeholders for this type of project)
    - Regulatory Requirements (identify relevant regulations/standards)
    
    Return the response as a JSON object with these exact keys:
    {
      "industry": "value",
      "projectType": "value",
      "country": "value",
      "budget": "value",
      "timeline": "value",
      "teamSize": "value",
      "stakeholders": "value",
      "regulations": "value"
    }
    
    Make sure the values are realistic and relevant to the project described.
  `;
  
  try {
    const response = await callAI(prompt, userId);
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error filling form with AI:', error);
    throw error;
  }
};

export const generateSolutions = async (risk: Risk, userId?: string): Promise<string[]> => {
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
    const response = await callAI(prompt, userId);
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