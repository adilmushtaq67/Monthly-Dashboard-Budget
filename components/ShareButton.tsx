
import React, { useState, useCallback } from 'react';
import { TwitterIcon, FacebookIcon, LinkedInIcon, ClipboardIcon } from './Icons';

interface ShareButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ isOpen, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyStatus('copied');
      setTimeout(() => {
        setCopyStatus('idle');
        onClose();
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }, [onClose]);

  if (!isOpen) {
    return null;
  }
  
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent("My Professional Budget Dashboard");
  const summary = encodeURIComponent("Check out this sleek, modern dashboard I'm using to track my monthly income, expenses, and savings!");
  
  const shareLinks = [
    { name: 'Twitter', icon: <TwitterIcon />, url: `https://twitter.com/intent/tweet?text=${summary}&url=${url}` },
    { name: 'Facebook', icon: <FacebookIcon />, url: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'LinkedIn', icon: <LinkedInIcon />, url: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}` }
  ];

  return (
    <div 
        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10 transition-all origin-top-right animate-fade-in-up"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="share-button"
    >
      <div className="py-1" role="none">
        {shareLinks.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            role="menuitem"
            onClick={onClose}
          >
            {link.icon}
            <span>Share on {link.name}</span>
          </a>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          role="menuitem"
        >
          <ClipboardIcon />
          <span>{copyStatus === 'copied' ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShareButton;
