# Product Filter Plugin for WordPress

A powerful and customizable product filter plugin for WordPress with dynamic filter management and extensive styling options.

## Features

- ✅ **Dynamic Filter Management** - Add, edit, remove, and reorder filters from the admin panel
- ✅ **Customizable Styling** - Adjust colors, borders, spacing, and typography
- ✅ **Drag & Drop Ordering** - Reorder filters with drag and drop
- ✅ **Enable/Disable Filters** - Toggle filters on/off without deleting them
- ✅ **Simple & Advanced Options** - Support for simple text options or advanced options with counts
- ✅ **Active Filter Display** - Show selected filters as removable tags
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Easy Integration** - Use shortcode anywhere on your site
- ✅ **JavaScript API** - Programmatically control filters

## Installation

### Method 1: Manual Upload

1. Download the plugin folder `product-filter-plugin`
2. Upload the folder to `/wp-content/plugins/` directory
3. Move the main plugin file `product-filter-plugin.php` into the plugin folder
4. Go to WordPress Admin → Plugins
5. Activate "Product Filter Plugin"

### Method 2: ZIP Upload

1. Compress the entire `product-filter-plugin` folder into a ZIP file
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Choose the ZIP file and click "Install Now"
4. Activate the plugin

## Directory Structure

```
product-filter-plugin/
├── product-filter-plugin.php    # Main plugin file
├── templates/
│   ├── admin-page.php           # Admin settings page
│   └── filter-widget.php        # Frontend filter widget
└── assets/
    ├── admin-script.js          # Admin JavaScript
    ├── admin-style.css          # Admin styles
    ├── frontend-script.js       # Frontend JavaScript
    └── frontend-style.css       # Frontend styles
```

## Usage

### Adding the Filter to Your Site

Use the shortcode anywhere you want the filter to appear:

```
[product_filter]
```

**In posts/pages:** Simply add the shortcode to the content editor

**In theme files:** Use the following PHP code:
```php
<?php echo do_shortcode('[product_filter]'); ?>
```

**In widgets:** Add a "Shortcode" widget and paste the shortcode

### Managing Filters

1. Go to WordPress Admin → Product Filter
2. Click "Add New Filter" button
3. Fill in the filter details:
   - **Filter ID**: Unique identifier (lowercase, no spaces) e.g., `size`, `color`, `brand`
   - **Filter Label**: Display name shown to users e.g., `Size`, `Color`, `Brand`
   - **Enabled**: Check to show this filter on the frontend
   - **Options**: Enter one option per line

#### Simple Options
```
Small
Medium
Large
Extra Large
```

#### Advanced Options (with counts)
Use the format: `id|name|count`
```
sm|Small|15
md|Medium|28
lg|Large|42
xl|Extra Large|10
```

### Customizing Appearance

1. Go to Product Filter → Styling Options tab
2. Adjust the following settings:
   - **Border**: Radius, width, and colors
   - **Colors**: Background and text colors for active/inactive states
   - **Badge**: Colors for filter count badges
   - **Typography**: Font size and padding

3. Click "Save Settings" to apply changes
4. Use "Reset to Default" to restore original styling

### Reordering Filters

1. Go to Product Filter → Manage Filters tab
2. Drag and drop filters using the drag handle (☰ icon)
3. Click "Save Changes" to save the new order

### Editing Filters

1. Click the "Edit" button on any filter
2. Modify the details
3. Click "Save Filter"

### Deleting Filters

1. Click the "Delete" button on any filter
2. Confirm the deletion
3. Click "Save Changes"

## JavaScript API

The plugin provides a JavaScript API for programmatic control:

### Get Active Filters
```javascript
const activeFilters = window.ProductFilterPlugin.getActiveFilters();
console.log(activeFilters);
// Output: { size: ['small', 'medium'], color: ['red'] }
```

### Set Filter Programmatically
```javascript
// Set single value
window.ProductFilterPlugin.setFilter('size', 'large');

// Set multiple values
window.ProductFilterPlugin.setFilter('color', ['red', 'blue']);
```

### Clear Specific Filter
```javascript
window.ProductFilterPlugin.clearFilter('size');
```

### Clear All Filters
```javascript
window.ProductFilterPlugin.clearAll();
```

### Listen for Filter Changes
```javascript
jQuery(document).on('pfp:filterChange', function(event, activeFilters) {
    console.log('Filters changed:', activeFilters);
    
    // Your custom logic here
    // e.g., filter products, update URL, etc.
});
```

## Integration Examples

### WooCommerce Integration

Add this to your theme's `functions.php`:

```php
add_action('wp_footer', function() {
    ?>
    <script>
    jQuery(document).on('pfp:filterChange', function(event, activeFilters) {
        // Build WooCommerce product query
        const params = new URLSearchParams();
        
        Object.entries(activeFilters).forEach(([category, values]) => {
            if (values.length > 0) {
                params.append(category, values.join(','));
            }
        });
        
        // Reload page with filter parameters
        window.location.search = params.toString();
    });
    </script>
    <?php
});
```

### Custom Product Filtering

```javascript
jQuery(document).on('pfp:filterChange', function(event, activeFilters) {
    // Show loading state
    jQuery('.products').addClass('loading');
    
    // Send AJAX request
    jQuery.ajax({
        url: '/wp-admin/admin-ajax.php',
        method: 'POST',
        data: {
            action: 'filter_products',
            filters: activeFilters
        },
        success: function(response) {
            jQuery('.products').html(response);
            jQuery('.products').removeClass('loading');
        }
    });
});
```

## Customization

### Custom CSS

Add custom CSS to override plugin styles:

```css
/* Change button colors */
.pfp-filter-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
}

/* Customize dropdown */
.pfp-dropdown-menu {
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    border-radius: 16px;
}
```

### Modify Filter Output

Use the filter hook to modify filter data:

```php
add_filter('pfp_filter_data', function($filters) {
    // Add custom logic
    return $filters;
});
```

## Troubleshooting

### Filters Not Showing
- Make sure the filter is enabled in the admin panel
- Check that you've saved your changes
- Verify the shortcode is placed correctly

### Styling Not Applying
- Clear your browser cache
- Clear WordPress cache if using a caching plugin
- Make sure you clicked "Save Settings"

### JavaScript Errors
- Check browser console for errors
- Ensure jQuery is loaded on your site
- Try deactivating other plugins to check for conflicts

## Support

For issues, questions, or feature requests, please contact the plugin developer.

## Changelog

### Version 1.0.0
- Initial release
- Dynamic filter management
- Customizable styling
- JavaScript API
- Responsive design
