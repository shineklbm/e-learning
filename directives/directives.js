
    directive('tumblrPost', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

        var getTemplate = function(contentType) {
            var templateLoader,
            baseUrl = '/templates/components/tumblr/',
            templateMap = {
                text: 'text.html',
                photo: 'photo.html',
                video: 'video.html',
                quote: 'quote.html',
                link: 'link.html',
                chat: 'chat.html',
                audio: 'audio.html',
                answer: 'answer.html'
            };

            var templateUrl = baseUrl + templateMap[contentType];
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;

        }

        var linker = function(scope, element, attrs) {

            var loader = getTemplate(scope.post.type);

            var promise = loader.success(function(html) {
                element.html(html);
            }).then(function (response) {
                element.replaceWith($compile(element.html())(scope));
            });
        }

        return {
            restrict: 'E',
            scope: {
                post:'='
            },
            link: linker
        };
    }]);