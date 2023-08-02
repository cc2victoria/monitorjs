const performanceMonitorPlugin = new PerformanceMonitorPlugin({
  reportApiSpeed: true,
  reportAssetsSpeed: true,
})

const requestMonitorPlugin = new RequestMonitorPlugin({
  exclude: ['cdnlog.zhenaioa.com'],
})

// console.log(123, Monitor, performanceMonitorPlugin)

Monitor.start({
  aid: 'pms.zheniaoa.com',
  performance: true,
  request: true, // request 和 performance 默认不开启，如果追踪的话，需要自定义开启，也可以用下面插件的方式开启
  plugins: [
    {
      name: 'jsErrorPlugin',
      setupOnce(client) {
        console.log(client)
      },
    },
    // performanceMonitorPlugin,
    // requestMonitorPlugin,
  ],
})

class FancyError extends Error {
  constructor(args) {
    super(args)
    this.name = 'FancyError'
  }
}

Monitor.captureError(new Error('A standard error'))
// { [Error: A standard error] }

Monitor.captureError(new FancyError('An augmented error'))

// setTimeout(() => {
//   Monitor.updateConfig({ userId: '110582003' });
//   throw new Error('test');
// }, 2000);

Monitor.captureError(Promise.reject(123))
Monitor.captureError('123', 'warning')

Monitor.updateConfig({
  userId: 110582003,
})

// performance.clearMarks();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#deny-url').addEventListener('click', () => {
    const script = document.createElement('script')
    script.crossOrigin = 'anonymous'
    script.src =
      'https://rawgit.com/kamilogorek/cfbe9f92196c6c61053b28b2d42e2f5d/raw/3aef6ff5e2fd2ad4a84205cd71e2496a445ebe1d/external-lib.js'
    document.body.appendChild(script)
  })

  document.querySelector('#allow-url').addEventListener('click', () => {
    const script = document.createElement('script')
    script.crossOrigin = 'anonymous'
    script.src =
      'https://rawgit.com/kamilogorek/cb67dafbd0e12b782bdcc1fbcaed2b87/raw/3aef6ff5e2fd2ad4a84205cd71e2496a445ebe1d/lib.js'
    document.body.appendChild(script)
  })

  document.querySelector('#ignore-message').addEventListener('click', () => {
    throw new Error('Exception that will be ignored because of this keyword => PickleRick_42 <=')
  })

  document.querySelector('#ignore-type').addEventListener('click', () => {
    throw new RangeError("Exception that will be ignored because of it's type")
  })

  document.querySelector('#regular-exception').addEventListener('click', () => {
    throw new Error(`Regular exception no. ${Date.now()}`)
  })

  document.querySelector('#capture-exception').addEventListener('click', () => {
    Monitor.captureError(new Error(`captureException call no. ${Date.now()}`))
  })

  document.querySelector('#capture-message').addEventListener('click', () => {
    Monitor.captureError(`captureMessage call no. ${Date.now()}`)
  })

  document.querySelector('#duplicate-exception').addEventListener('click', () => {
    Monitor.captureError(new Error('duplicated exception'))
  })

  document.querySelector('#duplicate-message').addEventListener('click', () => {
    Monitor.captureError('duplicate captureMessage')
  })

  document.querySelector('#integration-example').addEventListener('click', () => {
    Monitor.captureError('Happy Message')
  })

  document.querySelector('#exception-hint').addEventListener('click', () => {
    class CustomError extends Error {
      constructor(...args) {
        super(...args)
        this.name = 'CustomError'
      }
      someMethodAttachedToOurCustomError() {
        return new Promise((resolve) => {
          resolve('some data, who knows what exactly')
        })
      }
    }

    throw new CustomError('Hey there')
  })

  document.querySelector('#breadcrumb-hint').addEventListener('click', () => {})

  // document.querySelector('#deny-url').addEventListener('click', () => {
  //   const script = document.createElement('script');
  //   script.crossOrigin = 'anonymous';
  //   script.src =
  //     'https://rawgit.com/kamilogorek/cfbe9f92196c6c61053b28b2d42e2f5d/raw/3aef6ff5e2fd2ad4a84205cd71e2496a445ebe1d/external-lib.js';
  //   document.body.appendChild(script);
  // });

  // document.querySelector('#allow-url').addEventListener('click', () => {
  //   const script = document.createElement('script');
  //   script.crossOrigin = 'anonymous';
  //   script.src =
  //     'https://rawgit.com/kamilogorek/cb67dafbd0e12b782bdcc1fbcaed2b87/raw/3aef6ff5e2fd2ad4a84205cd71e2496a445ebe1d/lib.js';
  //   document.body.appendChild(script);
  // });

  // document.querySelector('#ignore-message').addEventListener('click', () => {
  //   throw new Error('Exception that will be ignored because of this keyword => PickleRick_42 <=');
  // });

  // document.querySelector('#ignore-type').addEventListener('click', () => {
  //   throw new RangeError("Exception that will be ignored because of it's type");
  // });

  // document.querySelector('#regular-exception').addEventListener('click', () => {
  //   throw new Error(`Regular exception no. ${Date.now()}`);
  // });

  // document.querySelector('#exception-hint').addEventListener('click', () => {
  //   class CustomError extends Error {
  //     constructor(...args) {
  //       super(...args);
  //       this.name = 'CustomError';
  //     }
  //     someMethodAttachedToOurCustomError() {
  //       return new Promise(resolve => {
  //         resolve('some data, who knows what exactly');
  //       });
  //     }
  //   }

  //   throw new CustomError('Hey there');
  // });

  // document.querySelector('#breadcrumb-hint').addEventListener('click', () => {});

  // Promise.reject('for promise test')
})
