/**! 
 * angular-blocks v0.1.9
 * Copyright (c) 2013 William L. Bunselmeyer. https://github.com/wmluke/angular-blocks
 * License: MIT
 */
/* global angular */
(function () {
    'use strict';

    function extendTemplate($templateCache, $compile, $http, $q, $log) {

        function warnMissingBlock(name, src) {
            $log.warn('Failed to find data-block=' + name + ' in ' + src);
        }

        return {
            compile: function (tElement, tAttrs) {
                var src = tAttrs.extendTemplate;
                if (!src) {
                    throw 'Template not specified in extend-template directive';
                }
                // Clone and then clear the template element to prevent expressions from being evaluated
                var $clone = tElement.clone();
                tElement.html('');

                var loadTemplate = $http.get(src, {cache: $templateCache})
                    .then(function (response) {
                        var template = response.data;
                        var $template = $(document.createElement('div')).html(template);

                        function override(method, $block, attr) {
                            var name = $block.attr(attr),
                                elements = $block.attr('data-only-contents') !== undefined ? $block.contents() : $block;

                            var namedBlock = $template.find('[data-block="' + name + '"]');
                            var inheritingBlock = $template.find('[data-extend-template]');
                            
                            if (namedBlock.length !== 0) {
                                namedBlock[method](elements);
                            } else if (inheritingBlock.length !== 0) {
                                inheritingBlock.append($block);
                            } else {
                                warnMissingBlock(name, src);
                            }
                        }

                        // Replace overridden blocks
                        $clone.children('[data-block]').each(function () {
                            override('replaceWith', $(this), 'data-block');
                        });

                        // Insert prepend blocks
                        $clone.children('[data-block-prepend]').each(function () {
                            override('prepend', $(this), 'data-block-prepend');
                        });

                        // Insert append blocks
                        $clone.children('[data-block-append]').each(function () {
                            override('append', $(this), 'data-block-append');
                        });

                        // Insert before blocks
                        $clone.children('[data-block-before]').each(function () {
                            override('before', $(this), 'data-block-before');
                        });

                        // Insert after blocks
                        $clone.children('[data-block-after]').each(function () {
                            override('after', $(this), 'data-block-after');
                        });

                        return $template;
                    }, function () {
                        var msg = 'Failed to load template: ' + src;
                        $log.error(msg);
                        return $q.reject(msg);
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
        .directive('extendTemplate', ['$templateCache', '$compile', '$http', '$q', '$log', extendTemplate]);
}());
