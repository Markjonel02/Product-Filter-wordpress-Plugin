<?php
if (!defined('ABSPATH')) {
    exit;
}

$filters = get_option('pfp_filters', array());
$settings = get_option('pfp_settings', array());
?>

<div class="pfp-filter-widget" data-settings='<?php echo esc_attr(json_encode($settings)); ?>'>
    <div class="pfp-filter-header">
        <div class="pfp-filter-info">
            <span class="pfp-active-count">0 active filters</span>
            <span class="pfp-separator">•</span>
            <span class="pfp-results-count">Loading...</span>
        </div>
    </div>
    
    <div class="pfp-filter-bar">
        <?php foreach ($filters as $filter): ?>
            <?php if (isset($filter['enabled']) && $filter['enabled']): ?>
                <div class="pfp-filter-dropdown" data-filter="<?php echo esc_attr($filter['id']); ?>">
                    <button class="pfp-filter-button" data-category="<?php echo esc_attr($filter['id']); ?>">
                        <span class="pfp-label"><?php echo esc_html($filter['label']); ?></span>
                        <span class="pfp-badge" style="display: none;">0</span>
                        <svg class="pfp-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    
                    <div class="pfp-dropdown-menu" style="display: none;">
                        <div class="pfp-dropdown-options">
                            <?php foreach ($filter['options'] as $option): ?>
                                <?php 
                                if (is_array($option)) {
                                    $optionId = $option['id'];
                                    $optionName = $option['name'];
                                    $optionCount = isset($option['count']) ? $option['count'] : null;
                                } else {
                                    $optionId = $option;
                                    $optionName = $option;
                                    $optionCount = null;
                                }
                                ?>
                                <label class="pfp-option">
                                    <input type="checkbox" 
                                           value="<?php echo esc_attr($optionId); ?>" 
                                           data-category="<?php echo esc_attr($filter['id']); ?>">
                                    <span class="pfp-option-label"><?php echo esc_html($optionName); ?></span>
                                    <?php if ($optionCount !== null): ?>
                                        <span class="pfp-option-count">(<?php echo esc_html($optionCount); ?>)</span>
                                    <?php endif; ?>
                                </label>
                            <?php endforeach; ?>
                        </div>
                        
                        <button class="pfp-clear-category" data-category="<?php echo esc_attr($filter['id']); ?>" style="display: none;">
                            Clear <?php echo esc_html($filter['label']); ?>
                        </button>
                    </div>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
        
        <button class="pfp-clear-all" style="display: none;">Clear All</button>
    </div>
    
    <div class="pfp-active-filters" style="display: none;"></div>
</div>
