<?php

namespace Drupal\mdx_editor\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'mdx_remote' formatter.
 *
 * @FieldFormatter(
 * id = "mdx_remote",
 * label = @Translation("MDX Remote Renderer"),
 * field_types = {
 * "text",
 * "text_long",
 * "text_with_summary"
 * }
 * )
 */
class MDXRemoteFormatter extends FormatterBase {
  public static function defaultSettings() {
    return [
      'render_style' => 'default',
      'enable_custom_components' => TRUE,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = parent::settingsForm($form, $form_state);

    $elements['render_style'] = [
      '#type' => 'select',
      '#title' => $this->t('Rendering style'),
      '#options' => [
        'default' => $this->t('Default style'),
        'minimal' => $this->t('Minimal style'),
        'rich' => $this->t('Rich style'),
      ],
      '#default_value' => $this->getSetting('render_style'),
      '#description' => $this->t('Choose a style for the rendered markdown content.'),
    ];

    $elements['enable_custom_components'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable custom components'),
      '#default_value' => $this->getSetting('enable_custom_components'),
      '#description' => $this->t('Allow custom React components like Map, Charts, etc. to be used in MDX content.'),
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    $summary[] = $this->t('Rendering style: @style', ['@style' => $this->getSetting('render_style')]);
    $summary[] = $this->t('Custom components: @enabled', [
      '@enabled' => $this->getSetting('enable_custom_components') ? $this->t('Enabled') : $this->t('Disabled'),
    ]);
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    $style = $this->getSetting('render_style');
    $enable_components = (bool) $this->getSetting('enable_custom_components'); // Ensure boolean

    foreach ($items as $delta => $item) {
      $unique_id = 'mdx-remote-' . $delta . '-' . uniqid();

      $elements[$delta] = [
        // Use the 'mdx_remote' theme hook defined in mdx_editor.module
        '#theme' => 'mdx_remote',
        // Pass the unique ID to the Twig template
        '#unique_id' => $unique_id,
        // Pass other variables needed by the template (e.g., for CSS classes)
        '#format' => $item->format,
        '#style' => $style,
        '#enable_components' => $enable_components,
        // Attach the necessary JS library and pass data via drupalSettings
        '#attached' => [
          'library' => [
            'mdx_editor/mdx-remote',
          ],
          'drupalSettings' => [
            'mdx_editor' => [
                $unique_id => [
                  'content' => $item->value, 
                  'style' => $style,
                  'enable_components' => $enable_components,
                ],
            ],
          ],
        ],
      ];

    }
    return $elements;
  }

}
