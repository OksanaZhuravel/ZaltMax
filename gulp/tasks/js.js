import webpack from 'webpack-stream';

export const js = () => {
  return (
    app.gulp
      .src(app.path.src.js, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'JS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(
        webpack({
          mode: app.isBuild ? 'production' : 'development',
          output: {
            filename: 'app.min.js',
          },
          module: {
            rules: [
              {
                test: /\.(scss|css)$/,
                use: [
                  'style-loader',

                  {
                    loader: 'string-replace-loader',
                    options: {
                      search: '@img',
                      replace: '../img',
                      flags: 'g',
                    },
                  },
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 3,
                      sourceMap: false,
                      modules: false,
                      url: {
                        filter: (url, resourcePath) => {
                          if (url.includes('img') || url.includes('fonts')) {
                            return false;
                          }
                          return true;
                        },
                      },
                    },
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: false,
                      sassOptions: {
                        // outputStyle: 'expanded',
                        outputStyle: 'compressed',
                      },
                    },
                  },
                ],
              },
            ],
          },
        })
      )
      // .pipe(
      //   webpack({
      //     mode: app.isBuild ? 'production' : 'development',
      //     output: {
      //       filename: 'app.min.js',
      //     },
      //   })
      // )
      .pipe(app.gulp.dest(app.path.build.js))
      .pipe(app.plugins.browsersync.stream())
  );
};
