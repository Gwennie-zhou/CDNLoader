import axios from "axios"

// 初始版
// export function get() {
//   return new Promise((resolve, reject)=> {
//     const scriptEle = document.createElement('script')
//     scriptEle.type = 'text/javascript'
//     scriptEle.src = 'https://static-resource-cos-1252524126.cdn.xiaoeknow.com/marketing/assets/share-button@1.0.4.js' 
//     scriptEle.addEventListener('load', () =>{
//       console.log("脚本加载完成");
//       // 因为组件打包的时候是通过umd方式打包的，因此在window上将可以通过文件名获得组件实例
      
//       const comp = window['share-button']
//       console.log(comp);
//       resolve(comp)
//     })
//     scriptEle.addEventListener('error', err => {
//       reject(err)
//     })

//     document.body.appendChild(scriptEle)
//   })
// }


// 改进版
// export function get(compName) {
//   return new Promise((resolve, reject)=> {
//     axios.get('xxx')
//     .then(res => {
//       const data = res.data
//       const url = data[compName][0]
//       const scriptEle = document.createElement('script')
//       scriptEle.type = 'text/javascript'
//       scriptEle.src = url

//       scriptEle.addEventListener('load', () =>{
//         console.log("脚本加载完成");
//         const comp = window[compName]
//         console.log(comp);
//         resolve(comp)
//       })

//       scriptEle.addEventListener('error', err => {
//         reject(err)
//       })
    
//       document.body.appendChild(scriptEle)
//     })
//   })
// }

// 最终版
const resolveSet = {}
const rejectSet = {}
const taskQueue = []

export function get(compName) {
  return new Promise((resolve, reject)=> {
    addPromiseCallBacks(compName, resolve, reject)
    startTaskQueue(compName)
  })
}
// 收集所有组件的成功和回调函数
function addPromiseCallBacks(compName, resolve, reject) {
  if (!resolveSet[compName]) {
    resolveSet[compName] = []
  }
  if (!rejectSet[compName]) {
    rejectSet[compName] = []
  }

  resolveSet[compName].push(resolve)
  rejectSet[compName].push(reject)
}

// 开启微任务队列
function startTaskQueue(compName) {
  taskQueue.push(compName)
  console.log('taskQueue',taskQueue);
  console.log('resolveSet',resolveSet);
  console.log('rejectSet',rejectSet);

  // 加个判断，微任务只要有一个就可以了
  if (taskQueue.length === 1) {
    Promise.resolve().then(()=>{
      // 请求后台接口
      axios.get('xxx') // 涉及公司测试店铺不方便提供接口信息
      .then(res => {
        const data = res.data
        // 根据任务队列动态创建script标签，每个组件只挂载一次
        const taskSet = Array.from(new Set(taskQueue))
        console.log(taskSet);

        taskSet.forEach(module => {
          const scriptEle = document.createElement('script')
          scriptEle.type = 'text/javascript'
          scriptEle.src = data[module][0]
          scriptEle.addEventListener('load', ()=>{
            // 加载完后可以通过window拿到组件实例
            const compInstance = window[module]
            resolveSet[module].forEach(resolve => resolve(compInstance))
          })

          scriptEle.addEventListener('error', err=> {
            console.log(`${module}脚本加载失败，失败信息：${err}`);
            rejectSet[module].forEach(reject => reject(err))
          })

          document.body.appendChild(scriptEle)
        })

      })
    })
  }

}






