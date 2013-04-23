/* global angular */
(function () {
    'use strict';

    function extendTemplate($templateCache, $compile) {
        return {
            compile: function (tElement, tAttrs) {
                // Get the extended template
                var template = $templateCache.get(tAttrs.extendTemplate);

                if (!template) {
                    throw 'Template does not exit: ' + tAttrs.extendTemplate;
                }

                var $template = $(document.createElement('div')).html(template);

                // Replace overridden blocks
                tElement.children('[data-block]').each(function () {
                    var $block = $(this);
                    var name = $block.attr('data-block');
                    $template.find('[data-block="' + name + '"]').replaceWith($block);
                });

                // Insert prepend blocks
                tElement.children('[data-block-prepend]').each(function () {
                    var $block = $(this);
                    var name = $block.attr('data-block-prepend');
                    $template.find('[data-block="' + name + '"]').prepend($block);
                });

                // Insert append blocks
                tElement.children('[data-block-append]').each(function () {
                    var $block = $(this);
                    var name = $block.attr('data-block-append');
                    $template.find('[data-block="' + name + '"]').append($block);
                });

                // Insert before blocks
                tElement.children('[data-block-before]').each(function () {
                    var $block = $(this);
                    var name = $block.attr('data-block-before');
                    $template.find('[data-block="' + name + '"]').before($block);
                });

                // Insert after blocks
                tElement.children('[data-block-after]').each(function () {
                    var $block = $(this);
                    var name = $block.attr('data-block-after');
                    $template.find('[data-block="' + name + '"]').after($block);
                });

                return function ($scope, $element) {
                    $element.html($template.html());
                    $compile($element.contents())($scope);
                };
            }
        };
    }

    angular.module('angular-blocks', [])
        .directive('extendTemplate', ['$templateCache', '$compile', extendTemplate]);
}());