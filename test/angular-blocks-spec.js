describe('angular-blocks directives', function () {
    'use strict';

    var $httpBackend, $scope;

    beforeEach(function () {
        var mainLayout = [
            '<header data-block="header"><p>{{ mainHeader }}</p></header>',
            '<div data-block="content"><p>:content</p></div>',
            '<footer data-block="footer"><p>:footer</p></footer>'
        ];

        var subLayout = [
            '<div data-extend-template="/main-layout.html">',
            '<div data-block="header"><p>{{ subHeader }}</p></div>',
            '</div>'
        ];
        module('angular-blocks');

        inject(function ($injector, $rootScope) {
            $scope = $rootScope.$new();
            $scope.mainHeader = ':header';
            $scope.subHeader = ':sub-header';
            $scope.foo = 'Bar';

            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.when('GET', '/main-layout.html').respond(mainLayout.join('/n'));
            $httpBackend.when('GET', '/sub-layout.html').respond(subLayout.join('/n'));
            $httpBackend.when('GET', '/foo.html').respond(404);
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('data-extend-template directive', function () {
        it('should throw an exception if the template fails to load', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/foo.html">',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            $compile(element)($scope);
            $scope.$digest();

            expect($log.assertEmpty());

            $httpBackend.flush();

            expect($log.error.logs[0][0]).toEqual('Failed to load template: /foo.html');
        }));

        it('should render nested layouts only once', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block="content">',
                '       <p ng-init="callCount=callCount+1">{{ callCount }}</p>',
                '   </div>',
                '</div>'
            ];

            $scope.callCount = 0;

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').text().trim()).toBe('1');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block directive', function () {
        it('should extend the content block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block="content">',
                '       <p>{{ foo }}</p>',
                '   </div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should support multiple inheritance', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block="content">',
                '       <p>{{ foo }}</p>',
                '   </div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should log a warning if the block is missing', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block="foo">',
                '       <p>{{ foo }}</p>',
                '   </div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect($log.warn.logs[0][0]).toEqual('Failed to find data-block=foo in /main-layout.html');
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block-prepend directive', function () {
        it('should prepend the content block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-prepend="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<div data-block-prepend="content"><p class="ng-binding">Bar</p></div><p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should support multiple inheritance', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block-prepend="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<div data-block-prepend="content"><p class="ng-binding">Bar</p></div><p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should log a warning if the block is missing', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-prepend="foo"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect($log.warn.logs[0][0]).toEqual('Failed to find data-block=foo in /main-layout.html');
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block-append directive', function () {
        it('should prepend the content block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-append="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p><div data-block-append="content"><p class="ng-binding">Bar</p></div>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should support multiple inheritance', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block-append="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p><div data-block-append="content"><p class="ng-binding">Bar</p></div>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should log a warning if the block is missing', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-append="foo"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect($log.warn.logs[0][0]).toEqual('Failed to find data-block=foo in /main-layout.html');
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });


    describe('data-block-before directive', function () {
        it('should prepend the content block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-before="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').prev().html().trim()).toBe('<p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should support multiple inheritance', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block-before="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').prev().html().trim()).toBe('<p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should log a warning if the block is missing', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-before="foo"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect($log.warn.logs[0][0]).toEqual('Failed to find data-block=foo in /main-layout.html');
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-block-after directive', function () {
        it('should prepend the content block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-after="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="content"]').next().html().trim()).toBe('<p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should prepend the content block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block-after="content"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="content"]').next().html().trim()).toBe('<p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should log a warning if the block is missing', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-after="foo"><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect($log.warn.logs[0][0]).toEqual('Failed to find data-block=foo in /main-layout.html');
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));
    });

    describe('data-only-contents directive attribute', function () {
        it('should append the contents of the block', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-append="content" data-only-contents><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p><p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should support multiple inheritance', inject(function ($compile) {
            var html = [
                '<div data-extend-template="/sub-layout.html">',
                '   <div data-block-append="content" data-only-contents><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:sub-header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p><p class="ng-binding">Bar</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

        it('should log a warning if the block is missing', inject(function ($compile, $log) {
            var html = [
                '<div data-extend-template="/main-layout.html">',
                '   <div data-block-append="foo" data-only-contents><p>{{ foo }}</p></div>',
                '</div>'
            ];

            var element = angular.element(html.join('\n'));
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.flush();

            expect($log.warn.logs[0][0]).toEqual('Failed to find data-block=foo in /main-layout.html');
            expect(element.find('[data-block="header"]').html().trim()).toBe('<p class="ng-binding">:header</p>');
            expect(element.find('[data-block="content"]').html().trim()).toBe('<p>:content</p>');
            expect(element.find('[data-block="footer"]').html().trim()).toBe('<p>:footer</p>');
        }));

    });

});
