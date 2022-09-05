const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function(app){
  app.use(createProxyMiddleware(['/main','/room','/room_admin','/login','/super_user','/super_admin','/super_room'],{
    target: 'http://localhost:4000',
    changeOrigin: true,
  })
);
};
