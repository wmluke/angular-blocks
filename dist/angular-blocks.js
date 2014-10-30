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

                var loadTemplate = $http.get(src, { cache: $templateCache })
                    .then(function (response) {
                        var template = response.data;
                        var $template = $(document.createElement('div')).html(template);

                        function override(method, $block, attr) {
                            var name = $block.attr(attr);
                            if ($template.find('[data-block="' + name + '"]')[method]($block).length === 0 &&
                                $template.find('[data-extend-template]').append($block).length === 0) {
                                warnMissingBlock(name, src);
                            }
                        }

                        function replaceAttrs(sourceElem, destElem, attrs) {
                            if (angular.isArray(attrs)) {
                                //replace only specified attributes
                                for (var i = 0; i < attrs.length; i += 1) {
                                    destElem.attr(attrs[i], sourceElem.attr(attrs[i]));
                                }
                            } else {
                                //replace all
                                var allAttributes = sourceElem[0].attributes;
                                for (var j = 0; j < allAttributes.length; j += 1) {
                                    destElem.attr(allAttributes[j].name, allAttributes[j].value);
                                }
                            }
                        }

                        function overrideAttrs($block, attrsToReplace) {
                            var name = $block.attr('data-block');
                            var templateBlocks = $template.find('[data-block="' + name + '"]');
                            if (!templateBlocks) {
                                warnMissingBlock(name, src);
                            } else {
                                templateBlocks.each(function (index, templateBlock) {
                                    replaceAttrs($block, $(templateBlock), attrsToReplace !== '' ? attrsToReplace.split(',') : null);
                                });
                            }
                        }

                        // Replace overridden blocks or attributes
                        $clone.children('[data-block]').each(function () {
                            var attrsToReplace = $(this).attr('replace-attrs');
                            if (attrsToReplace !== undefined) {
                                overrideAttrs($(this), attrsToReplace);
                            } else {
                                override('replaceWith', $(this), 'data-block');
                            }
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