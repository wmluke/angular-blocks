'use strict';

describe('angular-blocks directives', function () {

    var layout = [
        '<script type="text/ng-template" id="/layout.html">',
        '   <header data-block="header"><p>:header</p></header>',
        '   <div data-block="content"><p>:content</p></div>',
        '   <footer data-block="footer"><p>:footer</p></footer>',
        '</script>'
    ];


    beforeEach(module('angular-blocks'));

    describe('data-block directive', function () {
        it('should extend the content block', inject(function ($rootScope, $compile) {
            var html = [
                layout.join('\n'),
                '<div data-extend-template="/layout.html">',
                '   <div data-block="content">',
                '       <p>Foo</p>',
                '   </div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($rootScope);
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p>:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>Foo</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block-prepend directive', function () {
        it('should prepend the content block', inject(function ($rootScope, $compile) {
            var html = [
                layout.join('\n'),
                '<div data-extend-template="/layout.html">',
                '   <div data-block-prepend="content"><p>Foo</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($rootScope);
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p>:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<div data-block-prepend="content"><p>Foo</p></div><p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block-append directive', function () {
        it('should prepend the content block', inject(function ($rootScope, $compile) {
            var html = [
                layout.join('\n'),
                '<div data-extend-template="/layout.html">',
                '   <div data-block-append="content"><p>Foo</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($rootScope);

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p>:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p><div data-block-append="content"><p>Foo</p></div>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });


    describe('data-block-before directive', function () {
        it('should prepend the content block', inject(function ($rootScope, $compile) {
            var html = [
                layout.join('\n'),
                '<div data-extend-template="/layout.html">',
                '   <div data-block-before="content"><p>Foo</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($rootScope);

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p>:header</p>');
            expect(element.find('[data-block="content"]').prev().html().trim()).toBe('<p>Foo</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block-after directive', function () {
        it('should prepend the content block', inject(function ($rootScope, $compile) {
            var html = [
                layout.join('\n'),
                '<div data-extend-template="/layout.html">',
                '   <div data-block-after="content"><p>Foo</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($rootScope);

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p>:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="content"]').next().html().trim()).toBe('<p>Foo</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

});
