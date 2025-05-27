/**
 * Initializes Prism.js syntax highlighting and ensures proper class isolation
 */
(function ($, Drupal, once) {
    Drupal.behaviors.mdxSyntaxHighlighting = {
      attach: function (context, settings) {
        // Target all code blocks in MDX content areas
        once('mdx-syntax', '.mdx-rendered-content pre code, .mdx-remote-container pre code', context).forEach(function(element) {
          // Add an extra class for more specific CSS targeting
          element.parentNode.classList.add('mdx-code-block');
          
          // Force a specific parent pre class if needed
          if (!element.parentNode.classList.contains('language-')) {
            var lang = '';
            // Try to detect language from code's class
            Array.from(element.classList).forEach(function(cls) {
              if (cls.startsWith('language-')) {
                lang = cls.replace('language-', '');
              }
            });
            
            if (lang) {
              element.parentNode.classList.add('language-' + lang);
            }
          }
          
          // If Prism is available, reinitialize it on this element
          if (typeof Prism !== 'undefined') {
            Prism.highlightElement(element);
          }
        });
      }
    };
  })(jQuery, Drupal, once);