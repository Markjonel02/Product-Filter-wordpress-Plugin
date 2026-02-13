jQuery(document).ready(function($) {
    const $widget = $('.pfp-filter-widget');
    if ($widget.length === 0) return;
    
    const settings = $widget.data('settings') || {};
    const activeFilters = {};
    
    // Apply custom styling
    applyCustomStyles();
    
    // Initialize filters
    Object.keys(pfpData.filters).forEach(key => {
        const filter = pfpData.filters[key];
        if (filter.enabled) {
            activeFilters[filter.id] = [];
        }
    });
    
    // Toggle dropdown
    $('.pfp-filter-button').on('click', function(e) {
        e.stopPropagation();
        const $dropdown = $(this).closest('.pfp-filter-dropdown');
        const $menu = $dropdown.find('.pfp-dropdown-menu');
        
        // Close other dropdowns
        $('.pfp-dropdown-menu').not($menu).slideUp(200);
        $('.pfp-chevron').not($(this).find('.pfp-chevron')).css('transform', 'rotate(0deg)');
        
        // Toggle this dropdown
        $menu.slideToggle(200);
        $(this).find('.pfp-chevron').css(
            'transform',
            $menu.is(':visible') ? 'rotate(180deg)' : 'rotate(0deg)'
        );
    });
    
    // Close dropdowns when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.pfp-filter-dropdown').length) {
            $('.pfp-dropdown-menu').slideUp(200);
            $('.pfp-chevron').css('transform', 'rotate(0deg)');
        }
    });
    
    // Handle checkbox change
    $('input[type="checkbox"]', $widget).on('change', function() {
        const category = $(this).data('category');
        const value = $(this).val();
        
        if ($(this).is(':checked')) {
            if (!activeFilters[category].includes(value)) {
                activeFilters[category].push(value);
            }
        } else {
            activeFilters[category] = activeFilters[category].filter(v => v !== value);
        }
        
        updateUI();
        triggerFilterChange();
    });
    
    // Clear category
    $('.pfp-clear-category').on('click', function(e) {
        e.stopPropagation();
        const category = $(this).data('category');
        
        activeFilters[category] = [];
        $(`input[data-category="${category}"]`).prop('checked', false);
        
        updateUI();
        triggerFilterChange();
    });
    
    // Clear all filters
    $('.pfp-clear-all').on('click', function() {
        Object.keys(activeFilters).forEach(key => {
            activeFilters[key] = [];
        });
        
        $('input[type="checkbox"]', $widget).prop('checked', false);
        
        updateUI();
        triggerFilterChange();
    });
    
    // Remove active filter tag
    $(document).on('click', '.pfp-active-tag-remove', function() {
        const category = $(this).data('category');
        const value = $(this).data('value');
        
        activeFilters[category] = activeFilters[category].filter(v => v !== value);
        $(`input[value="${value}"][data-category="${category}"]`).prop('checked', false);
        
        updateUI();
        triggerFilterChange();
    });
    
    // Update UI
    function updateUI() {
        // Update badges and buttons
        Object.keys(activeFilters).forEach(category => {
            const count = activeFilters[category].length;
            const $button = $(`.pfp-filter-button[data-category="${category}"]`);
            const $badge = $button.find('.pfp-badge');
            const $clearBtn = $(`.pfp-clear-category[data-category="${category}"]`);
            
            if (count > 0) {
                $badge.text(count).show();
                $button.addClass('active');
                $clearBtn.show();
            } else {
                $badge.hide();
                $button.removeClass('active');
                $clearBtn.hide();
            }
        });
        
        // Update active count
        const totalActive = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
        $('.pfp-active-count').text(`${totalActive} active filter${totalActive !== 1 ? 's' : ''}`);
        
        // Show/hide clear all button
        if (totalActive > 0) {
            $('.pfp-clear-all').show();
        } else {
            $('.pfp-clear-all').hide();
        }
        
        // Update active filters display
        updateActiveFiltersDisplay();
    }
    
    // Update active filters tags display
    function updateActiveFiltersDisplay() {
        const $container = $('.pfp-active-filters');
        $container.empty();
        
        let hasActive = false;
        
        Object.entries(activeFilters).forEach(([category, values]) => {
            values.forEach(value => {
                hasActive = true;
                const $tag = $(`
                    <div class="pfp-active-tag">
                        <span class="pfp-active-tag-text">${value}</span>
                        <button class="pfp-active-tag-remove" data-category="${category}" data-value="${value}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                `);
                $container.append($tag);
            });
        });
        
        if (hasActive) {
            $container.show();
        } else {
            $container.hide();
        }
    }
    
    // Trigger filter change event
    function triggerFilterChange() {
        // Trigger custom event that can be listened to by other scripts
        $(document).trigger('pfp:filterChange', [activeFilters]);
        
        // Example: You can hook into this to filter WooCommerce products
        // Or update your custom product list
        console.log('Active filters:', activeFilters);
    }
    
    // Apply custom styles from settings
    function applyCustomStyles() {
        const $style = $('<style></style>');
        
        const css = `
            .pfp-filter-button {
                padding: ${settings.padding}px ${settings.padding * 1.5}px;
                border-radius: ${settings.borderRadius}px;
                border: ${settings.borderWidth}px solid ${settings.borderColor};
                background-color: ${settings.backgroundColor};
                color: ${settings.textColor};
                font-size: ${settings.fontSize}px;
            }
            
            .pfp-filter-button:hover {
                border-color: ${settings.activeBorderColor};
            }
            
            .pfp-filter-button.active {
                border-color: ${settings.activeBorderColor};
                background-color: ${settings.activeBackgroundColor};
                color: ${settings.activeTextColor};
            }
            
            .pfp-badge {
                background-color: ${settings.badgeBg};
                color: ${settings.badgeText};
                font-size: ${settings.fontSize - 2}px;
            }
            
            .pfp-dropdown-menu {
                background-color: ${settings.dropdownBg};
                border-radius: ${settings.borderRadius}px;
                box-shadow: ${settings.dropdownShadow};
                border: ${settings.borderWidth}px solid ${settings.borderColor};
            }
            
            .pfp-option {
                font-size: ${settings.fontSize}px;
                border-radius: ${settings.borderRadius / 2}px;
            }
            
            .pfp-option:hover {
                background-color: ${settings.activeBackgroundColor};
            }
            
            .pfp-option input:checked + .pfp-option-label {
                color: ${settings.activeTextColor};
                font-weight: 600;
            }
            
            .pfp-active-tag {
                background-color: ${settings.activeBackgroundColor};
                color: ${settings.activeTextColor};
                border-radius: ${settings.borderRadius / 2}px;
                font-size: ${settings.fontSize - 1}px;
                border: 1px solid ${settings.activeBorderColor};
            }
            
            .pfp-clear-all {
                padding: ${settings.padding}px ${settings.padding * 1.5}px;
                border-radius: ${settings.borderRadius}px;
                font-size: ${settings.fontSize}px;
            }
        `;
        
        $style.text(css);
        $('head').append($style);
    }
    
    // Public API
    window.ProductFilterPlugin = {
        getActiveFilters: function() {
            return activeFilters;
        },
        
        setFilter: function(category, values) {
            if (activeFilters.hasOwnProperty(category)) {
                activeFilters[category] = Array.isArray(values) ? values : [values];
                
                // Update checkboxes
                $(`input[data-category="${category}"]`).prop('checked', false);
                values.forEach(value => {
                    $(`input[value="${value}"][data-category="${category}"]`).prop('checked', true);
                });
                
                updateUI();
                triggerFilterChange();
            }
        },
        
        clearFilter: function(category) {
            if (activeFilters.hasOwnProperty(category)) {
                activeFilters[category] = [];
                $(`input[data-category="${category}"]`).prop('checked', false);
                updateUI();
                triggerFilterChange();
            }
        },
        
        clearAll: function() {
            Object.keys(activeFilters).forEach(key => {
                activeFilters[key] = [];
            });
            $('input[type="checkbox"]', $widget).prop('checked', false);
            updateUI();
            triggerFilterChange();
        }
    };
});
