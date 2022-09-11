<template>
    <div class="login">
        <div class="login-form" style="-webkit-app-region: no-drag">
            <c-login @doLogin="doLogin" @resetPwd="" @register="rVisible=true"></c-login>
        </div>
        <c-register :visible.sync="rVisible" @doRegister="doRegister"></c-register>
        <c-reset-pwd :visible.sync="sVisible" @doResetPwd="doResetPwd" ></c-reset-pwd>
        <a-modal v-model="visible" :footer="null" :width="1024" :mask-closable="false" :closable="false" :body-style="{padding:0}">
            <a-card title="已加入组织" :bordered="false" :extra="user&&user.userName+',您好，欢迎使用'">
                <a-row v-if="organUsers.length>0" type="flex" justify="start">
                    <template v-for="organUser of organUsers">
                        <a-col span="4" style="padding: 0 10px 10px 0;min-width: 150px" :key="organUser._id">
                            <a title="点击进入系统" style="color: #000000;" @click="goWelcome(organUser)">
                                <div style="text-align: center">
                                    <a-row style="margin-bottom: 12px">
                                        <a-avatar shape="square" :size="80" :style="{backgroundColor:'#259ebf'}">
                                            <div style="margin: 12px;">
                                                <c-icon type="building-one" :size="56" fill="#fff" :strokeWidth="3"></c-icon>
                                            </div>
                                        </a-avatar>
                                    </a-row>
                                    <a-row class="text">
                                        <a-tooltip placement="bottom" :title="organUser.idOrgan.organName">
                                            {{ organUser.idOrgan.organName }}
                                        </a-tooltip>
                                    </a-row>
                                    <span style="color: #2D8cF0;font-size: 10px">{{ '[' + userType.filter(item => item.code === organUser.userType)[0].name + ']' }}</span>
                                </div>
                            </a>
                        </a-col>
                    </template>
                </a-row>
                <a-empty description="暂未加入任何企业" v-else/>
            </a-card>
            <a-card title="更多操作" :bordered="false">
                <a-row>
                    <a-col span="4" style="padding: 0 10px 10px 0;min-width: 150px">
                        <a @click="Logout()" style="color: #000000;">
                            <div style="text-align: center">
                                <a-row style="margin-bottom: 24px">
                                    <a-avatar shape="square" :size="80" icon="poweroff" style="background-color:#ed4014"/>
                                </a-row>
                                <a-row>退出系统</a-row>
                            </div>
                        </a>
                    </a-col>
                    <a-col span="4" style="padding: 0 10px 10px 0;min-width: 150px">
                        <a @click="oVisible = true" style="color: #000000;">
                            <div style="text-align: center">
                                <a-row style="margin-bottom: 24px">
                                    <a-avatar shape="square" :size="80" icon="team" style="background-color:#1890FF"/>
                                </a-row>
                                <a-row>创建组织</a-row>
                            </div>
                        </a>
                    </a-col>
                </a-row>
            </a-card>
        </a-modal>
        <a-modal v-model="oVisible" title="组织创建" centered :mask-closable="false" :closable="false" dialogClass="noDrag" @ok="doRegisterOrgan">
            <a-form-model ref="form" labelAlign="left" :model="form" :rules="rule" :label-col="{span: 4}" :wrapper-col="{span: 20}">
                <a-form-model-item label="组织名称" prop="organName">
                    <a-input v-model="form.organName"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <div style="width:100%;text-align:center;font-size: 14px;bottom: 12px;position: fixed;">©
            2015-{{ new Date().getFullYear() }}
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import {CLogin, CRegister, CResetPwd} from "@clapjs/vue-core/components/CSign"

export default {
    components: {CLogin, CRegister, CResetPwd},
    data() {
        const validateOrganNamePass = async (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入组织名称！'));
            } else {
                const count = await this.$clap.model('org_organ').get({params: {filter: {organName: value}}}).then(el => el.count)
                if (count) {
                    callback(new Error('该组织名称已存在!'));
                } else {
                    callback();
                }
            }
        };
        return {
            visible: false,
            rVisible: false,
            sVisible: false,
            oVisible: false,
            form: {
                organName: '',
            },
            doLoginUser:{},
            rule: {
                organName: [{required: true, validator: validateOrganNamePass, trigger: 'change'}],
            },
            organ: require('../assets/icon/organ.png'),
            organUsers: [],
            userType: [],
        };
    },
    created() {
        document.title = '系统登录';
        this.getUserType();
        if (this.user) {
            this.getUserOrgans(this.user);
            this.visible = true;
        } else {
            this.$ls.remove('APPLICATIONS');
            this.$ls.remove('APPLICATION');
            this.$ls.remove('MENU');
        }
    },
    computed: {
        ...mapGetters(['user', 'applications']),
        electron() {
            return !!this.$electron
        }
    },
    methods: {
        ...mapActions(['Logout', 'SetUser', 'SetToken', 'SetGroup', 'SetOrgan', 'ToggleApplications', 'ToggleApplication', 'ToggleMenu']),
        async doLogin(user) {
            user.userCode = user.userCode.trim();
            user.userPwd = user.userPwd.trim();
            this.doLoginUser = user;
            const result = await this.$clap.http.post(this.$config.url.login, user);
            if (result.data.error.code === '0') {
              this.SetUser(result.data.record);
              await this.getUserOrgans(result.data.record._id);
              this.visible = true
            }
        },
        async doRegister(user) {
            const result = await this.$clap.http.post(this.$config.url.register, user);
            if (result.data.error.code === '0') {
                this.$confirm({
                    title: '确认',
                    content: '恭喜,注册成功!是否立即登录？',
                    centered: true,
                    onOk: async () => {
                        this.SetUser(result.data.record);
                        await this.getUserOrgans(result.data.record._id);
                        this.rVisible = false;
                        this.visible = true
                    }
                });
            }
        },
        async doResetPwd(user) {
            if(!user.userCode){
                user.userCode = this.doLoginUser.userCode
                user.userPwd = this.doLoginUser.userPwd
            }
            const result = await this.$clap.http.post(this.$config.url.changePwd, user);
            if (result.data.error.code === '0') {
                this.$success({
                    title: '密码修改成功,请重新登录!', onOk: () => {
                        this.sVisible = false;
                    }
                });
            }
        },
        async doRegisterOrgan() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    const result = await this.$clap.http.post(this.$config.url.registerOrgan, {
                        ...this.form,
                        idUser: this.user._id
                    });
                    if (result.data.error.code === '0') {
                        this.oVisible = false;
                        await this.getUserOrgans(this.user._id);
                    }
                }
            });
        },
        async getUserType() {
            this.userType = await this.$clap.model('cdp_application_group').get().then(res => res.records.reduce((array, item) => {
                return [...array, ...item.range.map(i => {
                    return {code: i.code, name: i.name}
                })]
            }, []));
        },
        async getUserOrgans(idUser) {
            this.organUsers = await this.$clap.model('org_organ_user').get({
                params: {
                    filter: {idUser},
                    populate: 'idOrgan',
                    order: 'idOrgan'
                }
            }).then(res => {
                return res.records.length ? res.records.reduce((sum, item) => {
                    switch (item.userType) {
                        case 'User':
                            sum.push(item)
                            break;
                        case 'Admin':
                            sum.push(item)
                            break;
                        case 'Supplier':
                            !sum.some(el => el.userType === 'Supplier') && sum.push(item)
                            break;
                        case 'Customer':
                            !sum.some(el => el.userType === 'Customer') && sum.push(item)
                            break;
                    }
                    return sum
                }, []) : [];
            });
        },
        goWelcome(organUser) {
            this.SetToken(organUser._id);
            this.SetGroup(organUser.idOrgan.idGroupOrgan);
            this.$clap.http.get('/clap/authority/application').then(async res => {
                if (res.data.records[0]) {
                    this.ToggleApplications(res.data.records.map(item => {
                        item.idApplication.title = item.idApplication.name;
                        item.idApplication.key = item.idApplication._id;
                        return item.idApplication
                    }))
                    await this.ToggleApplication(res.data.records[0].idApplication._id);
                    this.ToggleMenu({key: 'dash', title: '首页', routeName: 'dash', controlType: 'Group', idOrgan: '', organs: [], closable: false});
                } else {
                    this.$message.info('暂无可用权限，请联系您的的管理员！')
                }
            })
        }
    }
};
</script>

<style lang="less">

@import "~ant-design-vue/es/style/themes/default.less";

.login {
    width: 100%;
    height: 100%;
    background-image: url('../assets/backgroud/login.png');
    background-size: cover;
    background-position: center;

    &-form {
        position: absolute;
        right: 120px;
        top: 55%;
        transform: translateY(-60%);
        width: 450px;

        .form {
            padding: 0 20px;
        }
    }
}

.user-login-other {
    text-align: center;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
            color: @primary-color;
        }
    }
}

.text {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
