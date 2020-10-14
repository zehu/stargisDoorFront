import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'
import vueBus from "../../utils/vueBus";
import vuex from 'vuex'
const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      menus:[],
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: [],
      menusSecond:[]
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted () {
    this.updateMenu()
    // this.getMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    getMenu(){
      const { mode, theme, menu } = this
      const menuTree = menu.map(item => {
        const target = item.meta.target || null
        const tag = target && 'a' || 'router-link'
        let props = { to: { name: item.name } }
        if(item.route && item.route === '0'){
          props = { to: { path: item.path } }
        }
        const attrs = { href: item.path, target: item.meta.target }
        return (
          <Item {...{ key: item.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(item.meta.icon)}
              <span>{item.meta.title}</span>
            </tag>
          </Item>
        )
      })
      console.log(menuTree)
      return   <Menu>
        {menuTree}
      </Menu>
    },
    // select menu item
    onOpenChange (openKeys) {
      // 在水平模式下时执行，并且不再执行后续
     /* if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }*/
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
        console.log(this.selectedKeys)
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      const openKeys = []
      // if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      // }
      //update-begin-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
      if(!this.selectedKeys || this.selectedKeys[0].indexOf(":")<0){
        this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
      }
      //update-end-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
    },

    // render
    renderItem (menu) {
      if (!menu.hidden) {
          return menu.children && !menu.alwaysShow ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    inline(menu){
        return menu.children && !menu.alwaysShow ? this.renderSubMenus(menu) : this.renderMenuItem(menu)
    },
    renderSubMenus (menu) {
      const itemArr = []
      if(this.mode==='horizontal') {
        const target = menu.meta.target || null
        const tag = target && 'a' || 'router-link'
        let props = { to: { name: '' } }
        if(menu.route && menu.route === '0'){
          props = { to: { path: '' } }
        }
        const attrs = { href: '', target: menu.meta.target }
        if (menu.children) {
          // 把有子菜单的 并且 父菜单是要隐藏子菜单的
          // 都给子菜单增加一个 hidden 属性
          // 用来给刷新页面时， selectedKeys 做控制用
          menu.children.forEach(item => {
            item.meta = Object.assign(item.meta, { hidden: true })
          })
        }
        return (
          <Item {...{ key: menu.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
            </tag>
          </Item>
        )
      }else if(this.mode==='inline') {
        menu.children.forEach(item => {
          itemArr.push(this.renderItem(item))
        })
        return (
          <SubMenu {...{key: menu.path}}>
           <span slot="title">
             {this.renderIcon(menu.meta.icon)}
             <span>{menu.meta.title}</span>
           </span>
            {itemArr}
          </SubMenu>
        )
      }
    },
  /*  renderSubMenus (menu) {

      const itemArr = []
      console.log(this.mode)
      menu.children.forEach(item => {
        itemArr.push(this.renderItem(item))
      })
      return (
        <SubMenu {...{key: menu.path}}>
           <span slot="title">
             {this.renderIcon(menu.meta.icon)}
             <span>{menu.meta.title}</span>
           </span>
          {itemArr}
        </SubMenu>
      )
    },*/
    renderMenuItem (menu) {
      const target = menu.meta.target || null
      const tag = target && 'a' || 'router-link'
      let props = { to: { name: menu.name } }
      if(menu.route && menu.route === '0'){
        props = { to: { path: menu.path } }
      }

      const attrs = { href: menu.path, target: menu.meta.target }

      if (menu.children) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      return (
        <Item {...{ key: menu.path }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </tag>
        </Item>
      )
/*if(this.mode!='inline' || menu.name!="dashboard-analysis"){
  return (
    <Item {...{ key: menu.path }}>
      <tag {...{ props, attrs }}>
        {this.renderIcon(menu.meta.icon)}
        <span>{menu.meta.title}</span>

      </tag>
    </Item>
  )
}*/
    },
    renderSubMenu (menu) {
      const itemArr = []
      if(this.mode==='horizontal') {
        /*menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, {hidden: true})
          // itemArr.push(this.renderItem(item))
        })
       return (
         <SubMenu {...{ key: menu.path }}>
           <span slot="title">
             {this.renderIcon(menu.meta.icon)}
             <span>{menu.meta.title}</span>
           </span>
           {itemArr}
         </SubMenu>
       )*/
        const target = menu.meta.target || null
        const tag = target && 'a' || 'router-link'
        let props = { to: { name: '' } }
        if(menu.route && menu.route === '0'){
          props = { to: { path: '' } }
        }
        const attrs = { href: '', target: menu.meta.target }
        if (menu.children) {
          // 把有子菜单的 并且 父菜单是要隐藏子菜单的
          // 都给子菜单增加一个 hidden 属性
          // 用来给刷新页面时， selectedKeys 做控制用
          menu.children.forEach(item => {
            item.meta = Object.assign(item.meta, { hidden: true })
          })
        }
        return (
          <Item {...{ key: menu.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
            </tag>
          </Item>
        )
      }else if(this.mode==='inline') {
        menu.children.forEach(item => {
          itemArr.push(this.renderItem(item))
        })
        return (
          <SubMenu {...{key: menu.path}}>
           <span slot="title">
             {this.renderIcon(menu.meta.icon)}
             <span>{menu.meta.title}</span>
           </span>
            {itemArr}
          </SubMenu>
        )
      }
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        <Icon {... { props } }/>
      )
    }
  },
  getMenuSecond(val){
    console.log(val);
  },
  render () {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }
    console.log(this.selectedKeys)
    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      // return this.renderItem(item)
      if(item.path===this.selectedKeys[0]){
        // this.$emit('menuSecond',item)
        console.log(item)
        return this.inline(item)
      }else{
         return this.renderItem(item)
      }
    })
    // {...{ props, on: on }}
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
   return
  }
}
