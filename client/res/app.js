var app = angular.module('application', [
  'ui.router',
  'auais']);

//常量
app.constant('config', cfg);
app.constant('apiUrl', cfg.baseApiUrl);
app.constant('clientId', cfg.clientId);

app.config(function ($httpProvider,
                     authProvider,
                     districtProvider,
                     dictProvider,
                     RESTfulProvider) {

  //http服务拦截器，在控制台输出每次http请求的相关信息(信息是经过解码的，对人眼是友好的），调试时使用，部署时请删除！
  $httpProvider.interceptors.push(function () {
    return {
      request: function (config) {
        console.log('发出http ' + config.method + '请求: ' + unescape(decodeURI(config.url)));
        return config;
      }
    }
  });

  //http服务拦截器，为每次http请求添加代表用户权限的token，并在请求发生401无权限错误时向用户反馈信息
  $httpProvider.interceptors.push('authInterceptor');

  //配置auth服务的权限验证api网址、客户端id、客户端密钥
  authProvider.authUrl(cfg.authApiUrl).clientId(cfg.clientId).clientSecret(cfg.clientSecret);


  //api基地址
  RESTfulProvider.baseUrl(cfg.baseApiUrl);
  //获取行政区划的api地址
  districtProvider.districtUrl(cfg.districtApiUrl);
  //获取数据字典的api地址
  dictProvider.dictUrl(cfg.dictApiUrl);

});


app.run(function ($rootScope, clientId, $state, $timeout, auth, windowResize, browserStorage) {

    $rootScope.$clientId = clientId;
    //视觉效果逻辑

    var $setBodyBackgroundColor = function () {
      $rootScope.$bodyBackgroundColor = 'transparent';
      $timeout(function () {
        $rootScope.$bodyBackgroundColor = $('body').css('background-color');
      }, 1000);
    };
    $setBodyBackgroundColor();

    $rootScope.$themes = cfg.themes;
    var currentThemeName = browserStorage.local.get('current-theme');
    for (var i = cfg.themes.length; i--;) {
      if (cfg.themes[i].name === currentThemeName) {
        $rootScope.$currentTheme = cfg.themes[i];
        break;
      }
    }

    $rootScope.$currentTheme = $rootScope.$currentTheme || cfg.themes[0];
    $rootScope.$setTheme = function (theme) {
      if ($rootScope.$currentTheme === theme)return;
      $rootScope.$currentTheme = theme;
      browserStorage.local.set('current-theme', theme.name);
      $setBodyBackgroundColor();
    };

    $rootScope.$navbarInverse = browserStorage.local.get('navbar-inverse');
    $rootScope.$setNavbarInverse = function (navbarInverse) {
      $rootScope.$navbarInverse = navbarInverse;
      browserStorage.local.set('navbar-inverse', navbarInverse);
    };

    $rootScope.$navbarShadow = browserStorage.local.get('navbar-shadow');
    $rootScope.$setNavbarShadow = function (navbarShadow) {
      $rootScope.$navbarShadow = navbarShadow;
      browserStorage.local.set('navbar-shadow', navbarShadow);
    };


    //从浏览器存储中载入身份信息并附加到$rootScope
    auth.loadIdentity();

    //应用程序状态开始转换时的拦截器
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      //松绑window的resize事件处理器
      windowResize.unbind();
      //如果用户尚未登录，终止应用程序状态改变过程
      if (toState.name === 'login' || $rootScope.$identity.login) return;
      event.preventDefault();
      fromState.name !== 'login' && $state.go('login');
    });

    //应用程序状态完成转换时的拦截器，暂时空置
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    });

  }
)
;


app.controller('SiteController', function ($scope, http, apiUrl, config) {
  $scope.$states = config.states;
});



