/* global angular */
(function () {
    'use strict';

    function extendTemplate($templateCache, $compile, $http) {
        return {
            compile: function (tElement, tAttrs) {
                var src = tAttrs.extendTemplate;
                if (!src) {
                    throw 'Template not specified in extend-template directive';
                }
                var loadTemplate = $http.get(src, {cache: $templateCache})
                    .then(function (response) {
                        var template = response.data;
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

                        return $template;
                    }, function () {
                        throw 'Failed to load template: ' + src;
                    });


                return function ($scope, $element) {
                    loadTemplate.then(function ($template) {
                        $element.html($template.html());
                        $compile($element.contents())($scope);
                    });
                };
            }
        };
    }

    angular.module('angular-blocks', [])
        .directive('extendTemplate', ['$templateCache', '$compile', '$http', extendTemplate]);
}());