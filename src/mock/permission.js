import Mock from 'mockjs'
export default {
  getMenu: config => {
    // const { username, password } = JSON.parse(config.body)
    // console.log(JSON.parse(config.body))
    const { type, permission } = JSON.parse(config.body)
    console.log("type   " + type + '\n' + "permission   " + permission)
    console.log("getmenu    " + JSON.parse(config.body))
    // 先判断用户是否存在
    if (permission === '1' || permission === '2' || permission === '3') {
      // 判断账号和密码是否对应
      if (permission === '3') {
        return {
          type: '经办人',
          code: 20000,
          data: {
            menu: [
              {
                path: '/project',
                name: 'project',
                label: '项目管理',
                icon: 'user',
                url: 'ProjectManage/ProjectManage'
              },
              {
                path: "/file",
                name: "文档管理",
                label: "文档管理",
                icon: "location",
                url: "FileManage/FileManage"
              },
              {
                path: '/contractmanage',
                name: 'contract',
                label: '合同管理',
                icon: 'video-play',
                url: 'ContractManage/ContractManage'
              },
              {
                path: "/knowledge",
                name: "问答维护",
                label: '问答维护',
                icon: 'setting',
                url: 'Front/Knowledge'
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      } else if (permission === '1') {
        return {
          type: '审核人',
          code: 20000,
          data: {
            menu: [
              {
                path: '/check',
                name: 'check',
                label: '项目管理',
                icon: 'user',
                url: 'CheckManage/CheckManage'
              },
              {
                path: "/auditfile",
                name: "文档管理",
                label: "文档管理",
                icon: "location",
                url: "FileManage/AuditFileManage"
              },
              {
                path: '/contractmanage',
                name: 'contract',
                label: '合同管理',
                icon: 'video-play',
                url: 'ContractManage/ContractManage'
              },
              {
                path: "/knowledge",
                name: "问答维护",
                label: '问答维护',
                icon: 'setting',
                url: 'Front/Knowledge'
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      }
      else if (permission === '2') {
        return {
          type: '管理员',
          code: 20000,
          data: {
            menu: [
              {
                label: '客户管理',
                icon: 'user',
                children: [
                  {
                    path: "/mycustomer",
                    name: "我的客户",
                    label: '我的客户',
                    icon: 'setting',
                    url: 'CustomerManager/MyCustomer'
                  },
                  {
                    path: "/allcustomer",
                    name: "所有客户",
                    label: '所有客户',
                    icon: 'setting',
                    url: 'CustomerManager/AllCustomer'
                  }
                ]
              },
              {
                label: '用户管理',
                icon: 'user',
                children: [
                  {
                    path: "/user",
                    name: "用户信息",
                    label: '用户信息',
                    icon: 'setting',
                    url: 'UserManage/User'
                  },
                  {
                    path: "/alluer",
                    name: "所有用户",
                    label: '所有用户',
                    icon: 'setting',
                    url: 'UserManage/AllUer'
                  },
                  {
                    path: "/thisaccount",
                    name: "当前用户",
                    label: '当前用户',
                    icon: 'setting',
                    url: 'UserManage/ThisAccount'
                  },
                  {
                    path: "/modification",
                    name: "修改用户",
                    label: '修改用户',
                    icon: 'setting',
                    url: 'UserManage/Modification'
                  }
                ]
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      }

      else {
        return {
          code: -999,
          data: {
            message: '密码错误'
          }
        }
      }
    } else {
      return {
        code: -999,
        data: {
          message: '用户不存在'
        }
      }
    }
  }
}
