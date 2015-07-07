angular.module("eLearning")
.directive('textComponent', function(){
    return {
        restirct: "E",
        scope: {},
        templateUrl: 'framework/components/text-component.html',
        link: function(scope, element, attrs){
            scope.$parent.$watch('contents', function(newValue, oldValue) {
                if (newValue){
                    scope.custom_classes = attrs.classes;
                    scope.text_list = scope.$parent.contents[attrs.datasource];
                }                       
            }, true);
        }
    }
})
.directive('tabComponent', function(){
    return {
        restirct: "E",
        scope: {},
        templateUrl: 'framework/components/tab-component.html',
        link: function(scope, element, attrs){
            scope.$parent.$watch('contents', function(newValue, oldValue) {
                if (newValue){
                    scope.custom_classes = attrs.classes;
                    scope.tab_list = scope.$parent.contents[attrs.datasource];
                }                       
            }, true);
        }
    }
})
.directive('imageComponent', function(){
    return {
        restirct: "E",
        scope: {},
        templateUrl: 'framework/components/image-component.html',
        link: function(scope, element, attrs){
            scope.$parent.$watch('contents', function(newValue, oldValue) {
                if (newValue){
                    scope.custom_classes = attrs.classes;
                    scope.image_list = scope.$parent.contents[attrs.datasource];
                }                       
            }, true);
        }
    }
})
.directive('collapseComponent', function(){
    return {
        restirct: "E",
        scope: {},
        templateUrl: 'framework/components/collapse-component.html',
        link: function(scope, element, attrs){
            scope.$parent.$watch('contents', function(newValue, oldValue) {
                if (newValue){
                    scope.custom_classes = attrs.classes;
                    scope.collapse_list = scope.$parent.contents[attrs.datasource];
                }                       
            }, true);
        }
    }
});