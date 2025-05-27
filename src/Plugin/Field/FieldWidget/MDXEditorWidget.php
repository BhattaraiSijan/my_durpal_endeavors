<?php

namespace Drupal\mdx_editor\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation of the 'mdx_editor' widget.
 *
 * @FieldWidget(
 *   id = "mdx_editor_widget",
 *   label = @Translation("MDX Editor"),
 *   field_types = {
 *     "text_long",
 *     "text_with_summary"
 *   }
 * )
 */
class MDXEditorWidget extends WidgetBase implements ContainerFactoryPluginInterface {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['third_party_settings']
    );
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = isset($items[$delta]->value) ? $items[$delta]->value : '';
    $format = isset($items[$delta]->format) ? $items[$delta]->format : filter_default_format();
    
    // Setup the form elements for the MDX editor
    $element['value'] = [
      '#type' => 'textarea',
      '#default_value' => $value,
      '#rows' => 5,
      '#attributes' => [
        'class' => ['mdx-editor-field'],
        'data-mdx-editor' => 'true',
      ],
      '#attached' => [
        'library' => [
          'mdx_editor/mdx-editor',
        ],
      ],
    ];
    
    // Add format selection if available
    if ($this->getFieldSetting('text_processing')) {
      $element['format'] = [
        '#type' => 'select',
        '#title' => $this->t('Text format'),
        '#options' => $this->getFilterFormats(),
        '#default_value' => $format,
        '#access' => !empty($this->getFilterFormats()),
      ];
    }

    return $element;
  }

  /**
   * Returns available text formats for this field.
   */
  protected function getFilterFormats() {
    $formats = filter_formats();
    $options = [];
    
    foreach ($formats as $format) {
      $options[$format->id()] = $format->label();
    }
    
    return $options;
  }
  
  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    foreach ($values as &$value) {
      // Ensure the value is a string to avoid type mismatch errors
      if (isset($value['value']) && !is_string($value['value'])) {
        $value['value'] = (string) $value['value'];
      }
      
      // Ensure the value is never null
      if (is_null($value['value'])) {
        $value['value'] = '';
      }
    }
    
    return $values;
  }

}