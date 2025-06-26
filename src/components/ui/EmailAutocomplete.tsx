import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { X } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface EmailAutocompleteProps {
  selectedEmails: string[];
  onSelect: (email: string) => void;
  onRemove: (email: string) => void;
  label?: string;
  placeholder?: string;
  maxSelections?: number;
  availableEmails?: string[];
}

const EmailAutocomplete: React.FC<EmailAutocompleteProps> = ({
  selectedEmails,
  onSelect,
  onRemove,
  label = "Add Team Members",
  placeholder = "Type email to search users",
  maxSelections,
  availableEmails = []
}) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ email: string; displayName: string; jobTitle: string; isCurrentUser?: boolean }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = async (searchTerm: string) => {
    if (!searchTerm || !user) {
      setSuggestions([]);
      return;
    }

    try {
      setIsSearching(true);
      
      // Check if current user matches search and isn't already selected
      const currentUserMatches = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) && 
                                !selectedEmails.includes(user.email);
      
      let currentUserSuggestion: { email: string; displayName: string; jobTitle: string; isCurrentUser: boolean }[] = [];
      
      if (currentUserMatches) {
        currentUserSuggestion = [{
          email: user.email!,
          displayName: user.displayName || user.email!,
          jobTitle: 'You',
          isCurrentUser: true
        }];
      }
      
      // Filter from available emails (team members) - excluding current user since we handle it separately
      const teamMemberSuggestions = availableEmails
        .filter(email => 
          email.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !selectedEmails.includes(email) &&
          email !== user.email
        )
        .map(email => ({
          email,
          displayName: email,
          jobTitle: 'Team Member',
          isCurrentUser: false
        }));

      // Search in Firestore for additional users
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('email', '>=', searchTerm),
        where('email', '<=', searchTerm + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const firestoreUsers = querySnapshot.docs
        .map(doc => ({
          email: doc.data().email,
          displayName: doc.data().displayName,
          jobTitle: doc.data().jobTitle,
          isCurrentUser: false
        }))
        .filter(u => 
          u.email !== user.email && 
          !selectedEmails.includes(u.email) &&
          !teamMemberSuggestions.some(tm => tm.email === u.email)
        );
      
      // Combine all suggestions, prioritizing current user, then team members, then other users
      setSuggestions([...currentUserSuggestion, ...teamMemberSuggestions, ...firestoreUsers]);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    searchUsers(value);
  };

  const handleSelect = (suggestion: { email: string; displayName: string; jobTitle: string }) => {
    if (maxSelections && selectedEmails.length >= maxSelections) {
      return;
    }
    
    onSelect(suggestion.email);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleManualEntry = () => {
    const email = inputValue.trim();
    if (email && !selectedEmails.includes(email)) {
      if (maxSelections && selectedEmails.length >= maxSelections) {
        return;
      }
      onSelect(email);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } else {
        handleManualEntry();
      }
    }
  };

  const isMaxReached = maxSelections && selectedEmails.length >= maxSelections;

  return (
    <div ref={wrapperRef} className="space-y-2">
      <div className="relative">
        <Input
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? `Maximum ${maxSelections} selection(s) reached` : placeholder}
          disabled={isMaxReached}
        />
        
        {showSuggestions && inputValue && !isMaxReached && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
            {isSearching ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.email}
                    className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0 border-gray-100"
                    onClick={() => handleSelect(suggestion)}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate flex items-center">
                        {suggestion.displayName}
                        {suggestion.isCurrentUser && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{suggestion.email}</div>
                      {suggestion.jobTitle && !suggestion.isCurrentUser && (
                        <div className="text-xs text-gray-400 truncate">{suggestion.jobTitle}</div>
                      )}
                    </div>
                  </button>
                ))}
                <button
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-blue-600 border-t border-gray-200"
                  onClick={handleManualEntry}
                >
                  Add "{inputValue}" manually
                </button>
              </>
            ) : (
              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-blue-600"
                onClick={handleManualEntry}
              >
                Add "{inputValue}" manually
              </button>
            )}
          </div>
        )}
      </div>

      {selectedEmails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmails.map((email) => (
            <div
              key={email}
              className={`rounded-full px-3 py-1 text-sm flex items-center ${
                email === user?.email 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              <span>
                {email === user?.email ? `${email} (You)` : email}
              </span>
              <button
                onClick={() => onRemove(email)}
                className={`ml-2 hover:opacity-75 ${
                  email === user?.email ? 'text-green-600' : 'text-blue-600'
                }`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailAutocomplete;