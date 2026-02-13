jQuery(document).ready(function($) {
    let filters = [];
    let currentEditIndex = -1;
    
    // Load filters on page load
    loadFilters();
    loadSettings();
    
    // Tab switching
    $('.pfp-tab').on('click', function() {
        const tab = $(this).data('tab');
        
        $('.pfp-tab').removeClass('active');
        $(this).addClass('active');
        
        $('.pfp-tab-content').removeClass('active');
        $('#' + tab + '-tab').addClass('active');
    });
    
    // Load filters from server
    function loadFilters() {
        $.ajax({
            url: pfpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'pfp_get_filters',
                nonce: pfpAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    filters = response.data;
                    renderFilters();
                }
            }
        });
    }
    
    // Render filters list
    function renderFilters() {
        const $list = $('#filters-list');
        $list.empty();
        
        if (filters.length === 0) {
            $list.append('<p class="pfp-no-filters">No filters added yet. Click "Add New Filter" to get started.</p>');
            return;
        }
        
        filters.forEach((filter, index) => {
            const optionsCount = Array.isArray(filter.options) ? filter.options.length : 0;
            const enabled = filter.enabled ? 'Enabled' : 'Disabled';
            const statusClass = filter.enabled ? 'enabled' : 'disabled';
            
            const html = `
                <div class="pfp-filter-item ${statusClass}" data-index="${index}">
                    <div class="pfp-filter-drag">
                        <span class="dashicons dashicons-menu"></span>
                    </div>
                    <div class="pfp-filter-info">
                        <div class="pfp-filter-name">
                            <strong>${filter.label}</strong>
                            <code>${filter.id}</code>
                        </div>
                        <div class="pfp-filter-meta">
                            ${optionsCount} options • ${enabled}
                        </div>
                    </div>
                    <div class="pfp-filter-actions">
                        <button class="button edit-filter" data-index="${index}">
                            <span class="dashicons dashicons-edit"></span> Edit
                        </button>
                        <button class="button toggle-filter ${filter.enabled ? 'disable' : 'enable'}" data-index="${index}">
                            <span class="dashicons dashicons-${filter.enabled ? 'hidden' : 'visibility'}"></span>
                            ${filter.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button class="button delete-filter" data-index="${index}">
                            <span class="dashicons dashicons-trash"></span> Delete
                        </button>
                    </div>
                </div>
            `;
            
            $list.append(html);
        });
        
        // Make filters sortable
        if (typeof $.fn.sortable !== 'undefined') {
            $list.sortable({
                handle: '.pfp-filter-drag',
                update: function() {
                    reorderFilters();
                }
            });
        }
    }
    
    // Reorder filters after drag
    function reorderFilters() {
        const newOrder = [];
        $('#filters-list .pfp-filter-item').each(function() {
            const index = $(this).data('index');
            newOrder.push(filters[index]);
        });
        filters = newOrder;
        renderFilters();
    }
    
    // Add new filter button
    $('#add-new-filter').on('click', function() {
        currentEditIndex = -1;
        $('#modal-title').text('Add New Filter');
        $('#filter-index').val('');
        $('#filter-id').val('').prop('readonly', false);
        $('#filter-label').val('');
        $('#filter-enabled').prop('checked', true);
        $('#filter-options').val('');
        $('#filter-modal').fadeIn();
    });
    
    // Edit filter
    $(document).on('click', '.edit-filter', function() {
        currentEditIndex = $(this).data('index');
        const filter = filters[currentEditIndex];
        
        $('#modal-title').text('Edit Filter');
        $('#filter-index').val(currentEditIndex);
        $('#filter-id').val(filter.id).prop('readonly', true);
        $('#filter-label').val(filter.label);
        $('#filter-enabled').prop('checked', filter.enabled);
        
        // Convert options to textarea format
        let optionsText = '';
        if (Array.isArray(filter.options)) {
            filter.options.forEach(option => {
                if (typeof option === 'string') {
                    optionsText += option + '\n';
                } else {
                    optionsText += `${option.id}|${option.name}|${option.count || ''}\n`;
                }
            });
        }
        $('#filter-options').val(optionsText.trim());
        
        $('#filter-modal').fadeIn();
    });
    
    // Toggle filter enabled/disabled
    $(document).on('click', '.toggle-filter', function() {
        const index = $(this).data('index');
        filters[index].enabled = !filters[index].enabled;
        renderFilters();
    });
    
    // Delete filter
    $(document).on('click', '.delete-filter', function() {
        if (confirm('Are you sure you want to delete this filter?')) {
            const index = $(this).data('index');
            filters.splice(index, 1);
            renderFilters();
        }
    });
    
    // Save filter from modal
    $('#save-filter').on('click', function() {
        const id = $('#filter-id').val().trim();
        const label = $('#filter-label').val().trim();
        const enabled = $('#filter-enabled').is(':checked');
        const optionsText = $('#filter-options').val().trim();
        
        if (!id || !label) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Parse options
        const options = [];
        const lines = optionsText.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            
            // Check if it's advanced format (id|name|count)
            if (line.includes('|')) {
                const parts = line.split('|');
                options.push({
                    id: parts[0].trim(),
                    name: parts[1].trim(),
                    count: parts[2] ? parseInt(parts[2].trim()) : undefined
                });
            } else {
                options.push(line);
            }
        });
        
        const filterData = {
            id: id,
            label: label,
            enabled: enabled,
            options: options
        };
        
        if (currentEditIndex >= 0) {
            filters[currentEditIndex] = filterData;
        } else {
            filters.push(filterData);
        }
        
        renderFilters();
        $('#filter-modal').fadeOut();
    });
    
    // Close modal
    $('.pfp-close, #cancel-filter').on('click', function() {
        $('#filter-modal').fadeOut();
    });
    
    // Close modal on outside click
    $(window).on('click', function(e) {
        if ($(e.target).is('#filter-modal')) {
            $('#filter-modal').fadeOut();
        }
    });
    
    // Save filters to database
    $('#save-filters').on('click', function() {
        const $btn = $(this);
        $btn.prop('disabled', true).text('Saving...');
        
        $.ajax({
            url: pfpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'pfp_save_filters',
                nonce: pfpAdmin.nonce,
                filters: JSON.stringify(filters)
            },
            success: function(response) {
                if (response.success) {
                    alert('Filters saved successfully!');
                } else {
                    alert('Error saving filters: ' + response.data);
                }
            },
            error: function() {
                alert('Error saving filters. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Save Changes');
            }
        });
    });
    
    // Reset filters
    $('#reset-filters').on('click', function() {
        if (confirm('Are you sure you want to reset all filters to default?')) {
            loadFilters();
        }
    });
    
    // Load settings
    function loadSettings() {
        $.ajax({
            url: pfpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'pfp_get_settings',
                nonce: pfpAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    const settings = response.data;
                    applySettings(settings);
                }
            }
        });
    }
    
    // Apply settings to UI
    function applySettings(settings) {
        $('#border-radius').val(settings.borderRadius);
        $('#border-radius-value').text(settings.borderRadius);
        $('#border-width').val(settings.borderWidth);
        $('#border-width-value').text(settings.borderWidth);
        $('#border-color').val(settings.borderColor);
        $('#active-border-color').val(settings.activeBorderColor);
        $('#background-color').val(settings.backgroundColor);
        $('#active-background-color').val(settings.activeBackgroundColor);
        $('#text-color').val(settings.textColor);
        $('#active-text-color').val(settings.activeTextColor);
        $('#badge-bg').val(settings.badgeBg);
        $('#badge-text').val(settings.badgeText);
        $('#font-size').val(settings.fontSize);
        $('#font-size-value').text(settings.fontSize);
        $('#padding').val(settings.padding);
        $('#padding-value').text(settings.padding);
    }
    
    // Update slider values
    $('input[type="range"]').on('input', function() {
        const id = $(this).attr('id');
        const value = $(this).val();
        $('#' + id + '-value').text(value);
    });
    
    // Save settings
    $('#save-settings').on('click', function() {
        const $btn = $(this);
        $btn.prop('disabled', true).text('Saving...');
        
        const settings = {
            borderRadius: parseInt($('#border-radius').val()),
            borderWidth: parseInt($('#border-width').val()),
            borderColor: $('#border-color').val(),
            activeBorderColor: $('#active-border-color').val(),
            backgroundColor: $('#background-color').val(),
            activeBackgroundColor: $('#active-background-color').val(),
            textColor: $('#text-color').val(),
            activeTextColor: $('#active-text-color').val(),
            fontSize: parseInt($('#font-size').val()),
            padding: parseInt($('#padding').val()),
            dropdownBg: '#ffffff',
            dropdownShadow: '0 10px 40px rgba(0,0,0,0.1)',
            badgeBg: $('#badge-bg').val(),
            badgeText: $('#badge-text').val()
        };
        
        $.ajax({
            url: pfpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'pfp_save_settings',
                nonce: pfpAdmin.nonce,
                settings: JSON.stringify(settings)
            },
            success: function(response) {
                if (response.success) {
                    alert('Settings saved successfully!');
                } else {
                    alert('Error saving settings: ' + response.data);
                }
            },
            error: function() {
                alert('Error saving settings. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Save Settings');
            }
        });
    });
    
    // Reset settings
    $('#reset-settings').on('click', function() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            loadSettings();
        }
    });
});
