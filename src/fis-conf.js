//FIS3 configuration
fis.set('project.ignore', ['node_modules/**']);
fis.hook('relative');
//开启相对路径
fis.match('**', { relative: true });
fis.set('project.charset', 'utf8');
//编译ES6
fis.match('*.es6', {
    parser: fis.plugin('babel-5.x', {
        blacklist: ['regenerator'],
        stage: 3
    }),
    rExt: 'js',
    useHash: true
});
//编译SASS
fis.match('**.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('node-sass', {
        //fis-parser-node-sass option
    }),
	useHash: true
});
//JS处理
fis.match('*.js', {useHash: false});
//css处理
fis.match('*.css', {useHash: false,optimizer: fis.plugin('clean-css')});
// 直接 release 到本地项目的target目录下
fis.match('*', {
	deploy: fis.plugin('local-deliver', {
		to: '../../dist'
	})
});
