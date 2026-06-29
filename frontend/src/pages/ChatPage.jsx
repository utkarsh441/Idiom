import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import { useFriends } from '../hooks/useFriends';
import { useChat } from '../hooks/useChat';

const TranslationBubble = ({ msg, selectedFriend }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  
  const isMe = msg.senderId === selectedFriend?._id ? false : true;
  const hasTranslation = msg.translation && msg.translation.translatedText;
  const messageContent = msg.message || msg.text || "";

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full`}>
      
      <div className={`max-w-[70%] relative pb-5 rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
        isMe 
          ? 'bg-[#00CF85] text-[#050B14] font-semibold rounded-tr-none shadow-md shadow-[#00CF85]/5' 
          : 'bg-[#0A111E] border border-slate-800 text-slate-200 rounded-tl-none'
      }`}>
        <div>
          {isMe 
            ? messageContent 
            : (hasTranslation && !showOriginal ? msg.translation.translatedText : messageContent)
          }
        </div>

      
        {!isMe && hasTranslation && !showOriginal && (
          <span className="absolute bottom-1.5 right-3 text-[10px] font-semibold text-amber-500/80 tracking-wide select-none">
            Translated
          </span>
        )}

       
        {!isMe && showOriginal && (
          <span className="absolute bottom-1.5 right-3 text-[10px] font-semibold text-slate-500 tracking-wide select-none italic">
            Original
          </span>
        )}
      </div>

      
      {!isMe && hasTranslation && (
        <button
          type="button"
          onClick={() => setShowOriginal(!showOriginal)}
          className="text-[10px] text-slate-500 hover:text-[#00CF85] transition-colors mt-1 px-1 bg-transparent border-none cursor-pointer focus:outline-none tracking-wide"
        >
          {showOriginal ? "Translation" : " View Original Language"}
        </button>
      )}
    </div>
  );
};

const ChatPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  const messagesEndRef = useRef(null);

  
  const {
    friends, setFriends,
    searchQuery, setSearchQuery,
    searchResult, setSearchResult,
    isPanelOpen, setIsPanelOpen,
    handleSearchSubmit,
    handleAddFriend,
    handleRemoveFriend
  } = useFriends(API_URL);

 
  const { 
    chatMessages, 
    messageText, 
    setMessageText, 
    handleSendMessage 
  } = useChat(API_URL, user?._id, selectedFriend, setFriends);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

 
  const handleDirectChat = (targetUser) => {
    setSelectedFriend(targetUser); 
    setIsPanelOpen(false);   
    setSearchQuery('');    
    setSearchResult(null);   
    setFriends(prev => (prev || []).map(f => f._id === targetUser._id ? { ...f, hasUnread: false } : f));
  };

  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  const isCurrentlyFriend = (friends || []).some(f => f._id === selectedFriend?._id);

  
  const handleInlineFriendshipToggle = async () => {
    if (!selectedFriend?._id) return;
    
    if (isCurrentlyFriend) {
      await handleRemoveFriend(selectedFriend._id, selectedFriend.username, selectedFriend._id, setSelectedFriend);
    } else {
      await handleAddFriend(selectedFriend._id, selectedFriend.username);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B14] p-4 font-sans text-slate-200 overflow-hidden">
      <div className="w-full max-w-5xl h-[85vh] rounded-2xl border border-slate-800/50 bg-[#0A111E] shadow-2xl flex flex-col overflow-hidden relative">
        
        
        <header className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between bg-[#070D17]">
          <div className="flex items-center space-x-3 min-w-0">
            {selectedFriend && (
              <img 
                src={selectedFriend.profilePicture || "https://avatar.iran.liara.run/public"} 
                alt="Chat Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
              />
            )}
            <div className={`h-3 w-3 rounded-full animate-pulse shrink-0 ${isCurrentlyFriend ? 'bg-[#00CF85]' : 'bg-amber-500'} ${selectedFriend ? 'hidden' : 'block'}`} />
            <h1 className="text-base font-bold text-slate-100 truncate">
              {selectedFriend ? `Chat with ${selectedFriend.fullname || selectedFriend.username}` : "Main Chat Workspace"}
            </h1>
          </div>
          
            
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => navigate('/settings')}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs font-semibold text-slate-400 hover:text-[#00CF85] hover:border-[#00CF85]/30 hover:bg-slate-800 transition-all flex items-center gap-1.5"
              title="Tune profile preferences and language translations"
            >
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs font-semibold text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-slate-800 transition-all"
            >
              Log Out
            </button>
          </div>
        </header>

        
        <div className="flex-1 flex bg-[#050B14]/30 overflow-hidden relative">
          
          
          <aside className="w-80 border-r border-slate-800/40 bg-[#080E1A]/50 p-4 flex flex-col hidden md:flex">
            
            
            <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search username..."
                  className="w-full rounded-xl bg-[#050B14] border border-slate-800 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-[#00CF85] focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResult(null); }}
                    className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3 rounded-xl bg-[#00CF85] text-xs font-bold text-[#050B14] hover:bg-[#00b574] transition-all"
              >
                Find
              </button>
            </form>

            
            <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 px-1">Conversations & Friends</div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {(friends || []).length === 0 ? (
                <div className="text-xs text-slate-600 p-2 italic">No context strings active. Search users above to begin.</div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    onClick={() => handleDirectChat(friend)}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all ${
                      selectedFriend?._id === friend._id
                        ? 'bg-[#00CF85]/10 text-[#00CF85] border border-[#00CF85]/20'
                        : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {friend.profilePicture ? (
                        <img 
                          src={friend.profilePicture} 
                          alt={friend.username} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 uppercase shrink-0">
                          {friend.fullname?.charAt(0) || friend.username?.charAt(0)}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate text-slate-200 group-hover:text-slate-100">
                          {friend.fullname || friend.username}
                        </span>
                        <span className="text-xs text-slate-500 truncate">@{friend.username}</span>
                      </div>
                    </div>

                    
                    {friend.hasUnread && (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#00CF85] shadow-[0_0_10px_#00CF85] animate-pulse absolute right-3" />
                    )}
                  </div>
                ))
              )}
            </div>
          </aside>

          
          <main className="flex-1 flex flex-col justify-between p-6 bg-[#050B14]/10 overflow-hidden">
            {selectedFriend ? (
              <>
                
                <div className="mb-4 p-3 rounded-xl bg-[#0A111E] border border-slate-800/60 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wide uppercase text-slate-500">Contact Rules Status</p>
                    <p className="text-xs text-slate-300 truncate">
                      {isCurrentlyFriend ? "Verified Secure Contact" : "Non-Friend Connection Loop Active"}
                    </p>
                  </div>
                  
                  
                  {selectedFriend._id !== user?._id && (
                    <>
                      {isCurrentlyFriend && (
                        <button
                          onClick={handleInlineFriendshipToggle}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97] border bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        >
                          Remove Friend
                        </button>
                      )}

                      {!isCurrentlyFriend && (
                        <button
                          onClick={handleInlineFriendshipToggle}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97] border bg-[#00CF85]/10 text-[#00CF85] border-[#00CF85]/20 hover:bg-[#00CF85]/20"
                        >
                          Add Friend
                        </button>
                      )}
                    </>
                  )}
                </div>

               
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 flex flex-col">
                  {(chatMessages || []).length === 0 ? (
                    <div className="text-center text-xs text-slate-600 my-auto">
                      Chat with Them
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <TranslationBubble 
                        key={msg._id || index} 
                        msg={msg} 
                        selectedFriend={selectedFriend} 
                      />
                    ))
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Message @${selectedFriend.username}...`}
                    className="flex-1 rounded-xl bg-[#050B14] border border-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-[#00CF85] focus:outline-none focus:ring-1 focus:ring-[#00CF85] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-5 rounded-xl bg-[#00CF85] text-sm font-semibold text-[#050B14] hover:bg-[#00b574] transition-all"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              /* Minimalist screen when no chat selected*/
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <div className="p-4 bg-[#0A111E] border border-slate-800 rounded-full shadow-inner text-3xl">
                  Chat
                </div>
                <h3 className="text-base font-semibold text-slate-300">No Chat Selected</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  What are you doing Go Chat
                </p>
              </div>
            )}
          </main>

          
          <div 
            className={`absolute top-0 right-0 h-full w-80 bg-[#0A111E] border-l border-slate-800/80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${
              isPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Verify User</h3>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition-all text-xs font-semibold"
              >
                ✕ Close
              </button>
            </div>

            {searchResult && (
              <div className="flex flex-col items-center text-center flex-1 justify-center -mt-12">
                {searchResult.profilePicture ? (
                  <img 
                    src={searchResult.profilePicture} 
                    alt={searchResult.username} 
                    className="h-24 w-24 rounded-full object-cover border-2 border-[#00CF85] shadow-lg shadow-[#00CF85]/10 mb-4"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-slate-400 uppercase mb-4">
                    {searchResult.fullname?.charAt(0) || searchResult.username?.charAt(0)}
                  </div>
                )}

                <h2 className="text-xl font-bold text-slate-100">{searchResult.fullname}</h2>
                <p className="text-sm text-[#00CF85] font-medium mt-0.5">@{searchResult.username}</p>
                
                <p className="text-xs text-slate-500 max-w-[200px] mt-4 italic">
                  {searchResult.bio || "Secure connection ready to establish contact strings."}
                </p>

                
                <div className="w-full space-y-2 mt-8">
                  <button
                    onClick={() => handleDirectChat(searchResult)}
                    className="w-full py-3 bg-[#00CF85] text-[#050B14] font-bold rounded-xl shadow-md hover:bg-[#00b574] active:scale-[0.98] transition-all text-sm"
                  >
                    Chat Now
                  </button>

                  {searchResult._id !== user?._id && (
                    <>
                      {!(friends || []).some(f => f._id === searchResult._id) && (
                        <button
                          onClick={() => handleAddFriend(searchResult._id, searchResult.username)}
                          className="w-full py-3 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold rounded-xl shadow-md active:scale-[0.98] transition-all text-sm"
                        >
                          Connect & Add Friend
                        </button>
                      )}

                      {(friends || []).some(f => f._id === searchResult._id) && (
                        <button
                          onClick={() => handleRemoveFriend(searchResult._id, searchResult.username, selectedFriend?._id, setSelectedFriend)}
                          className="w-full py-2.5 bg-red-950/20 border border-red-900/30 text-red-400 font-medium rounded-xl hover:bg-red-900/20 active:scale-[0.98] transition-all text-xs mt-4"
                        >
                          Unfriend User
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;