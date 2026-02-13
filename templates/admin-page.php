<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap pfp-admin-wrap">
    <h1>Product Filter Settings</h1>
    
    <div class="pfp-admin-container">
        <div class="pfp-tabs">
            <button class="pfp-tab active" data-tab="filters">Manage Filters</button>
            <button class="pfp-tab" data-tab="styling">Styling Options</button>
            <button class="pfp-tab" data-tab="shortcode">Shortcode</button>
        </div>
        
        <!-- Filters Tab -->
        <div class="pfp-tab-content active" id="filters-tab">
            <div class="pfp-section">
                <div class="pfp-section-header">
                    <h2>Filters</h2>
                    <button class="button button-primary" id="add-new-filter">
                        <span class="dashicons dashicons-plus-alt"></span> Add New Filter
                    </button>
                </div>
                
                <div id="filters-list" class="pfp-filters-list">
                    <!-- Filters will be loaded here via JavaScript -->
                </div>
                
                <div class="pfp-actions">
                    <button class="button button-primary button-large" id="save-filters">Save Changes</button>
                    <button class="button button-secondary button-large" id="reset-filters">Reset to Default</button>
                </div>
            </div>
        </div>
        
        <!-- Styling Tab -->
        <div class="pfp-tab-content" id="styling-tab">
            <div class="pfp-section">
                <h2>Appearance Settings</h2>
                
                <div class="pfp-styling-grid">
                    <!-- Border Settings -->
                    <div class="pfp-setting-group">
                        <h3>Border</h3>
                        <div class="pfp-setting">
                            <label>Border Radius (<span id="border-radius-value">24</span>px)</label>
                            <input type="range" id="border-radius" min="0" max="50" value="24">
                        </div>
                        <div class="pfp-setting">
                            <label>Border Width (<span id="border-width-value">2</span>px)</label>
                            <input type="range" id="border-width" min="0" max="6" value="2">
                        </div>
                        <div class="pfp-setting">
                            <label>Border Color</label>
                            <input type="color" id="border-color" value="#e0f2f1">
                        </div>
                        <div class="pfp-setting">
                            <label>Active Border Color</label>
                            <input type="color" id="active-border-color" value="#00bcd4">
                        </div>
                    </div>
                    
                    <!-- Colors -->
                    <div class="pfp-setting-group">
                        <h3>Colors</h3>
                        <div class="pfp-setting">
                            <label>Background Color</label>
                            <input type="color" id="background-color" value="#ffffff">
                        </div>
                        <div class="pfp-setting">
                            <label>Active Background Color</label>
                            <input type="color" id="active-background-color" value="#e0f2f1">
                        </div>
                        <div class="pfp-setting">
                            <label>Text Color</label>
                            <input type="color" id="text-color" value="#334155">
                        </div>
                        <div class="pfp-setting">
                            <label>Active Text Color</label>
                            <input type="color" id="active-text-color" value="#00838f">
                        </div>
                    </div>
                    
                    <!-- Badge -->
                    <div class="pfp-setting-group">
                        <h3>Badge</h3>
                        <div class="pfp-setting">
                            <label>Badge Background</label>
                            <input type="color" id="badge-bg" value="#00bcd4">
                        </div>
                        <div class="pfp-setting">
                            <label>Badge Text Color</label>
                            <input type="color" id="badge-text" value="#ffffff">
                        </div>
                    </div>
                    
                    <!-- Typography -->
                    <div class="pfp-setting-group">
                        <h3>Typography</h3>
                        <div class="pfp-setting">
                            <label>Font Size (<span id="font-size-value">14</span>px)</label>
                            <input type="range" id="font-size" min="10" max="20" value="14">
                        </div>
                        <div class="pfp-setting">
                            <label>Padding (<span id="padding-value">12</span>px)</label>
                            <input type="range" id="padding" min="6" max="24" value="12">
                        </div>
                    </div>
                </div>
                
                <div class="pfp-actions">
                    <button class="button button-primary button-large" id="save-settings">Save Settings</button>
                    <button class="button button-secondary button-large" id="reset-settings">Reset to Default</button>
                </div>
            </div>
        </div>
        
        <!-- Shortcode Tab -->
        <div class="pfp-tab-content" id="shortcode-tab">
            <div class="pfp-section">
                <h2>How to Use</h2>
                <p>Use the following shortcode to display the product filter on any page or post:</p>
                
                <div class="pfp-shortcode-box">
                    <code>[product_filter]</code>
                    <button class="button" onclick="navigator.clipboard.writeText('[product_filter]')">Copy</button>
                </div>
                
                <h3>Optional Parameters</h3>
                <p>You can customize the shortcode with additional parameters:</p>
                
                <div class="pfp-shortcode-box">
                    <code>[product_filter class="custom-class"]</code>
                    <button class="button" onclick="navigator.clipboard.writeText('[product_filter class=&quot;custom-class&quot;]')">Copy</button>
                </div>
                
                <h3>PHP Template Usage</h3>
                <p>You can also add the filter directly in your theme files:</p>
                
                <div class="pfp-shortcode-box">
                    <code>&lt;?php echo do_shortcode('[product_filter]'); ?&gt;</code>
                    <button class="button" onclick="navigator.clipboard.writeText('<?php echo do_shortcode(\'[product_filter]\'); ?>')">Copy</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Filter Modal Template -->
<div id="filter-modal" class="pfp-modal" style="display: none;">
    <div class="pfp-modal-content">
        <div class="pfp-modal-header">
            <h2 id="modal-title">Add New Filter</h2>
            <span class="pfp-close">&times;</span>
        </div>
        <div class="pfp-modal-body">
            <input type="hidden" id="filter-index" value="">
            
            <div class="pfp-form-group">
                <label>Filter ID (lowercase, no spaces)</label>
                <input type="text" id="filter-id" class="pfp-input" placeholder="e.g., size, brand, category">
            </div>
            
            <div class="pfp-form-group">
                <label>Filter Label (displayed to users)</label>
                <input type="text" id="filter-label" class="pfp-input" placeholder="e.g., Size, Brand, Category">
            </div>
            
            <div class="pfp-form-group">
                <label>
                    <input type="checkbox" id="filter-enabled" checked> Enabled
                </label>
            </div>
            
            <div class="pfp-form-group">
                <label>Options (one per line)</label>
                <textarea id="filter-options" class="pfp-textarea" rows="6" placeholder="Small&#10;Medium&#10;Large"></textarea>
                <small>For advanced options with counts, use format: id|name|count (e.g., sm|Small|10)</small>
            </div>
        </div>
        <div class="pfp-modal-footer">
            <button class="button button-secondary" id="cancel-filter">Cancel</button>
            <button class="button button-primary" id="save-filter">Save Filter</button>
        </div>
    </div>
</div>
