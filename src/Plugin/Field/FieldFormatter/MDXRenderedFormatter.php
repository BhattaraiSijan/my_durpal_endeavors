<?php

namespace Drupal\mdx_editor\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'mdx_rendered' formatter.
 *
 * @FieldFormatter(
 *   id = "mdx_rendered",
 *   label = @Translation("MDX Rendered"),
 *   field_types = {
 *     "text",
 *     "text_long",
 *     "text_with_summary"
 *   }
 * )
 */
class MDXRenderedFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'render_style' => 'default',
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
    
    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    $summary[] = $this->t('Rendering style: @style', ['@style' => $this->getSetting('render_style')]);
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    $style = $this->getSetting('render_style');
    
    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#theme' => 'mdx_rendered',
        '#content' => $item->value,
        '#format' => $item->format,
        '#style' => $style,
        '#attached' => [
          'library' => [
            'mdx_editor/mdx-renderer',
            'mdx_editor/prism',
          ],
        ],
      ];
    }
    
    return $elements;
  }

}