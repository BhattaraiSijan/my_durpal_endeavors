import React from 'react';
import { createRoot } from 'react-dom/client';
import MDXEditorComponent from './MDXEditorComponent';
// import EditorPage from './EnhancedMdxEditor.tsx';
import './styles.css';

(function ($, Drupal, once) {
  Drupal.behaviors.mdxEditor = {
    attach: function (context, settings) {
      once('mdx-editor', '.mdx-editor-field', context).forEach(function (element) {
        const container = document.createElement('div');
        container.className = 'mdx-editor-react-container';
        element.parentNode.insertBefore(container, element);
        
        // Hide the original textarea but keep it in the DOM for form submission
        element.style.display = 'none';
        
        const initialContent = element.value !== null && element.value !== undefined 
          ? element.value 
          : '';
        
        try {
          const root = createRoot(container);
          root.render(
            <MDXEditorComponent 
              textarea={element}
              initialContent={initialContent}
            />
          );
        } catch (error) {
          console.error('Error initializing MDX Editor:', error);
          element.style.display = 'block';
        }
      });
    }
  };
})(jQuery, Drupal, once);