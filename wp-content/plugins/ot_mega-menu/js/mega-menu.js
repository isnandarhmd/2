var taMegaMenu;
(function ($, _) {
    'use strict';

    var api,
        wp = window.wp;

    api = taMegaMenu = {
        init: function () {
            api.$body = $('body');
            api.$modal = $('#tamm-settings');
            api.$elementorModal = $('#tamm-settings-elementor');
            api.itemData = {};
            api.templates = {
                menus: wp.template('tamm-menus'),
                title: wp.template('tamm-title'),
                mega: wp.template('tamm-mega')
            };

            api.frame = wp.media({
                library: {
                    type: 'image'
                }
            });

            this.initActions();
        },

        initActions: function () {
            api.$body
                .on('click', '.opensettings', this.openModal)
                .on('click', '.tamm-modal-backdrop, .tamm-modal-close, .tamm-button-cancel', this.closeModal)
                .on('click', '.ot-tamm-modal-elementor-backdrop, .ot-tamm-modal-elementor-close', this.closeMenuContent);

            api.$modal
                .on('click', '.tamm-menu a', this.switchPanel)
                .on('click', '.tamm-button-save', this.saveChanges)
                .on('click', '.ot-edit-mega-menu', this.openMenuContent);
        },

        openModal: function () {
            api.getItemData(this);

            api.$modal.show();
            api.$body.addClass('modal-open');
            api.render();

            return false;
        },

        openMenuContent: function () {
            api.getItemData(this);
            api.$elementorModal.show();
            api.$body.addClass('modal-open');

            var menuId = $(this).data('menu-id'),
                $iframeId = $('#ot-mega-menu-content-frame-' + menuId),
                iframeSrc = '?ot_tamm_menu_id=' + menuId + '&ot_tamm_mega_elementor=true',
                iframe = '<iframe id="ot-mega-menu-content-frame-' + menuId + '" src="' + iframeSrc + '" class="ot-mega-menu-content-frame active"></iframe>';

            $('.ot-mega-menu-content-frame').removeClass('active');
            if ($iframeId.length < 1) {
                api.$elementorModal.find('.media-modal-content').append(iframe);
            }
            $iframeId.addClass('active');

            api.render();

            return false;
        },

        closeModal: function () {
            api.$modal.hide().find('.tamm-content').html('');
            api.$body.removeClass('modal-open');
            return false;
        },
        closeMenuContent: function () {
            api.$elementorModal.hide();
            api.$body.removeClass('modal-open');
            return false;
        },


        switchPanel: function (e) {
            e.preventDefault();

            var $el = $(this),
                panel = $el.data('panel');

            $el.addClass('active').siblings('.active').removeClass('active');
            api.openSettings(panel);
        },

        render: function () {
            // Render menu
            api.$modal.find('.tamm-frame-menu .tamm-menu').html(api.templates.menus(api.itemData));

            var $activeMenu = api.$modal.find('.tamm-menu a.active');

            // Render content
            this.openSettings($activeMenu.data('panel'));
        },

        openSettings: function (panel) {
            var $content = api.$modal.find('.tamm-frame-content .tamm-content'),
                $panel = $content.children('#tamm-panel-' + panel);

            if ($panel.length) {
                $panel.addClass('active').siblings().removeClass('active');
            } else {
                $content.append(api.templates[panel](api.itemData));
                $content.children('#tamm-panel-' + panel).addClass('active').siblings().removeClass('active');
            }

            // Render title
            var title = api.$modal.find('.tamm-frame-menu .tamm-menu a[data-panel=' + panel + ']').data('title');
            api.$modal.find('.tamm-frame-title').html(api.templates.title({title: title}));
        },

        getItemData: function (menuItem) {
            var $menuItem = $(menuItem).closest('li.menu-item'),
                $menuData = $menuItem.find('.tamm-data'),
                children = $menuItem.childMenuItems();

            api.itemData = {
                depth: $menuItem.menuItemDepth(),
                megaData: {
                    mega: $menuData.data('mega')
                },
                data: $menuItem.getItemData(),
                children: [],
                originalElement: $menuItem.get(0)
            };

            if (!_.isEmpty(children)) {
                _.each(children, function (item) {
                    var $item = $(item),
                        $itemData = $item.find('.tamm-data'),
                        depth = $item.menuItemDepth();

                    api.itemData.children.push({
                        depth: depth,
                        subDepth: depth - api.itemData.depth - 1,
                        data: $item.getItemData(),
                        megaData: {
                            mega: $itemData.data('mega')
                        },
                        originalElement: item
                    });
                });
            }

        },

        setItemData: function (item, data, depth) {
            if (!_.has(data, 'mega')) {
                data.mega = false;
            }

            var $dataHolder = $(item).find('.tamm-data');
            $dataHolder.data(data);

        },

        getFieldName: function (name, id) {
            name = name.split('.');
            name = '[' + name.join('][') + ']';

            return 'menu-item[' + id + ']' + name;
        },

        saveChanges: function () {
            var data = api.$modal.find('.tamm-content :input').serialize(),
                $spinner = api.$modal.find('.tamm-toolbar .spinner');

            $spinner.addClass('is-active');

            $.post(ajaxurl, {
                action: 'tamm_save_menu_item_data',
                data: data
            }, function (res) {
                if (!res.success) {
                    return;
                }

                var data = res.data['menu-item'];

                /*Update parent menu item*/
                if (_.has(data, api.itemData.data['menu-item-db-id'])) {
                    api.setItemData(api.itemData.originalElement, data[api.itemData.data['menu-item-db-id']], 0);
                }

                _.each(api.itemData.children, function (menuItem) {
                    if (!_.has(data, menuItem.data['menu-item-db-id'])) {
                        return;
                    }

                    api.setItemData(menuItem.originalElement, data[menuItem.data['menu-item-db-id']], 1);
                });

                $spinner.removeClass('is-active');
                api.closeModal();
            });
        }
    };

    $(function () {
        taMegaMenu.init();
    });

})(jQuery, _);