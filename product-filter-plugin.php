<?php
/**
 * Plugin Name: Product Filter Plugin
 * Plugin URI: https://yoursite.com
 * Description: A customizable product filter plugin with dynamic filter management
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yoursite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: product-filter-plugin
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PFP_VERSION', '1.0.0');
define('PFP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PFP_PLUGIN_URL', plugin_dir_url(__FILE__));

class Product_Filter_Plugin {
    
    public function __construct() {
        // Activation hook
        register_activation_hook(__FILE__, array($this, 'activate'));
        
        // Admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Enqueue scripts
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        
        // AJAX handlers
        add_action('wp_ajax_pfp_save_filters', array($this, 'save_filters'));
        add_action('wp_ajax_pfp_get_filters', array($this, 'get_filters'));
        add_action('wp_ajax_pfp_save_settings', array($this, 'save_settings'));
        add_action('wp_ajax_pfp_get_settings', array($this, 'get_settings'));
        
        // Shortcode
        add_shortcode('product_filter', array($this, 'render_filter_shortcode'));
    }
    
    public function activate() {
        // Set default filters on activation
        $default_filters = array(
            array(
                'id' => 'temperature',
                'label' => 'TOG | Temperature',
                'enabled' => true,
                'options' => array('TOG 0.2', 'TOG 0.5', 'TOG 1.0', 'TOG 2.5')
            ),
            array(
                'id' => 'ageSize',
                'label' => 'Age | Size',
                'enabled' => true,
                'options' => array('0-3 months', '3-6 months', '6-12 months', '12-18 months', '18-24 months')
            ),
            array(
                'id' => 'stage',
                'label' => 'Stage',
                'enabled' => true,
                'options' => array(
                    array('id' => 'stage1', 'name' => 'Stage 1 - Newborn & Swaddling', 'count' => 67),
                    array('id' => 'stage2', 'name' => 'Stage 2 - Ready to Roll', 'count' => 45),
                    array('id' => 'stage3', 'name' => 'Stage 3 - On the Move', 'count' => 41),
                    array('id' => 'all', 'name' => 'All Stages', 'count' => 58)
                )
            ),
            array(
                'id' => 'fabric',
                'label' => 'Fabric',
                'enabled' => true,
                'options' => array('Cotton', 'Bamboo', 'Organic Cotton', 'Merino Wool')
            ),
            array(
                'id' => 'color',
                'label' => 'Color',
                'enabled' => true,
                'options' => array('White', 'Gray', 'Blue', 'Pink', 'Neutral')
            ),
            array(
                'id' => 'productType',
                'label' => 'Product type',
                'enabled' => true,
                'options' => array('Sleep Bag', 'Swaddle', 'Blanket', 'Sleepsuit')
            ),
            array(
                'id' => 'promotions',
                'label' => 'Promotions',
                'enabled' => true,
                'options' => array('Sale', 'New', 'Best Seller')
            )
        );
        
        $default_settings = array(
            'borderRadius' => 24,
            'borderWidth' => 2,
            'borderColor' => '#e0f2f1',
            'activeBorderColor' => '#00bcd4',
            'backgroundColor' => '#ffffff',
            'activeBackgroundColor' => '#e0f2f1',
            'textColor' => '#334155',
            'activeTextColor' => '#00838f',
            'fontSize' => 14,
            'padding' => 12,
            'dropdownBg' => '#ffffff',
            'dropdownShadow' => '0 10px 40px rgba(0,0,0,0.1)',
            'badgeBg' => '#00bcd4',
            'badgeText' => '#ffffff'
        );
        
        add_option('pfp_filters', $default_filters);
        add_option('pfp_settings', $default_settings);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Product Filter Settings',
            'Product Filter',
            'manage_options',
            'product-filter-plugin',
            array($this, 'render_admin_page'),
            'dashicons-filter',
            30
        );
    }
    
    public function enqueue_admin_scripts($hook) {
        if ($hook !== 'toplevel_page_product-filter-plugin') {
            return;
        }
        
        wp_enqueue_style('pfp-admin-style', PFP_PLUGIN_URL . 'assets/admin-style.css', array(), PFP_VERSION);
        wp_enqueue_script('pfp-admin-script', PFP_PLUGIN_URL . 'assets/admin-script.js', array('jquery'), PFP_VERSION, true);
        
        wp_localize_script('pfp-admin-script', 'pfpAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('pfp_admin_nonce')
        ));
    }
    
    public function enqueue_frontend_scripts() {
        wp_enqueue_style('pfp-frontend-style', PFP_PLUGIN_URL . 'assets/frontend-style.css', array(), PFP_VERSION);
        wp_enqueue_script('pfp-frontend-script', PFP_PLUGIN_URL . 'assets/frontend-script.js', array('jquery'), PFP_VERSION, true);
        
        wp_localize_script('pfp-frontend-script', 'pfpData', array(
            'filters' => get_option('pfp_filters', array()),
            'settings' => get_option('pfp_settings', array())
        ));
    }
    
    public function save_filters() {
        check_ajax_referer('pfp_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $filters = json_decode(stripslashes($_POST['filters']), true);
        update_option('pfp_filters', $filters);
        
        wp_send_json_success('Filters saved successfully');
    }
    
    public function get_filters() {
        check_ajax_referer('pfp_admin_nonce', 'nonce');
        
        $filters = get_option('pfp_filters', array());
        wp_send_json_success($filters);
    }
    
    public function save_settings() {
        check_ajax_referer('pfp_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $settings = json_decode(stripslashes($_POST['settings']), true);
        update_option('pfp_settings', $settings);
        
        wp_send_json_success('Settings saved successfully');
    }
    
    public function get_settings() {
        check_ajax_referer('pfp_admin_nonce', 'nonce');
        
        $settings = get_option('pfp_settings', array());
        wp_send_json_success($settings);
    }
    
    public function render_admin_page() {
        include PFP_PLUGIN_DIR . 'templates/admin-page.php';
    }
    
    public function render_filter_shortcode($atts) {
        $atts = shortcode_atts(array(
            'class' => ''
        ), $atts);
        
        ob_start();
        include PFP_PLUGIN_DIR . 'templates/filter-widget.php';
        return ob_get_clean();
    }
}

// Initialize the plugin
new Product_Filter_Plugin();
