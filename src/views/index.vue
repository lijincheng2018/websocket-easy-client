<template>
    <el-main>
        <div style="text-align: center; font-size: 25px; margin-bottom: 30px;">WebSocket Easy Client</div>
        <el-form ref="form" :model="form" label-width="180px">

            <el-form-item label="WebSocket服务端地址：">
                <el-input v-model="form.serverAddress" :disabled="socket === null ? false : true">
                    <template slot="prepend">ws://</template>
                    <el-button slot="append" :icon="socket === null ? 'el-icon-link' : 'el-icon-error'"
                        @click="socket === null ? connetSever(form.serverAddress) : disconnetSever()">{{ socket === null ?
                            '连接' : '断开' }}</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="连接状态：">
                <el-tag :type="socket === null ? 'danger' : 'success'">{{ socket === null ? '未连接' : '已连接' }}</el-tag>
            </el-form-item>
            <el-form-item label="发送信息：">
                <el-input v-model="form.clientMessage" :disabled="socket === null ? true : false">
                    <el-button slot="append" icon="el-icon-position" :disabled="socket === null ? true : false"
                        @click="sendMessage(form.clientMessage)">发送</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="服务器消息：">
                <el-button type="primary" icon="el-icon-delete" size="medium" @click="clearLogBox">清空消息</el-button>
                <div class="serverLogBox">
                    <el-scrollbar ref="myScrollbar" style="height:100%">
                        <p v-html="form.serverLog"></p>
                    </el-scrollbar>
                </div>
            </el-form-item>

        </el-form>
        
    </el-main>
</template>

<script>
import { Loading } from 'element-ui'
export default {
    data() {
        return {
            form: {
                serverAddress: 'localhost:8110',
                serverLog: '',
                clientMessage: '请先连接服务器哦~'
            },
            socket: null,

        }
    },
    methods: {
        getDate() {
            let date = new Date();
            let year = date.getFullYear(); // 年
            let month = date.getMonth() + 1; // 月
            let day = date.getDate(); // 日
            let hour = date.getHours(); // 时
            hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
            let minute = date.getMinutes(); // 分
            minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
            let second = date.getSeconds(); // 秒
            second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
            return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
        },
        scrollDown() {
            this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight
        },
        clearLogBox() {
            this.form.serverLog = '';
            this.$message.success('清空消息成功~');
        },
        connetSever(serverAddress) {
            const connectWebSocket = (url) => {
                let loading = Loading.service({
                    text: '连接服务器中，请稍后...',
                    background: 'rgba(0,0,0,.5)'
                })

                const socket = new WebSocket('ws://' + url);
                let returnSocket = socket;
                socket.addEventListener('open', () => {
                    console.log('success');
                    this.form.serverLog += '[' + this.getDate() + ']<span style="color: green"> 连接服务器成功！</span><br>';
                    this.form.clientMessage = '';
                });

                socket.addEventListener('error', () => {
                    console.error('error');
                    this.form.serverLog += '[' + this.getDate() + ']<span style="color: red"> 连接服务器失败！</span><br>';
                    returnSocket = null;
                    this.socket = null;
                    loading.close();
                });

                loading.close();
                return returnSocket;
            }

            this.socket = connectWebSocket(serverAddress);
            

            this.socket.onmessage = (messages) => {
                let nowTime = this.getDate();
                let recievedData = messages.data.toString();
                console.log(recievedData);
                this.form.serverLog += '[' + nowTime + ']<span style="color: purple"> 接收到：' + recievedData + '</span><br>';
            }
        },
        disconnetSever() {
            this.socket.close();
            this.form.serverLog += '[' + this.getDate() + ']<span style="color: orange"> 断开服务器成功！</span><br>';
            this.socket = null;
            this.form.clientMessage = '请先连接服务器哦~';
        },
        sendMessage(message) {
            this.socket.send(message);
            this.form.serverLog += '[' + this.getDate() + ']<span style="color: blue"> 发送：' + message + '</span><br>';
            this.form.clientMessage = '';
        },
        sendMessageToClient(socket, message) {
            const sendResult = new Promise((resolve, reject) => {
                socket.onerror = function () {
                    reject(new Error('WebSocket error'));
                };

                socket.onclose = function () {
                    reject(new Error('WebSocket closed'));
                };

                socket.onopen = function () {
                    socket.send(message);
                    resolve('Message sent');
                };
            });

            return sendResult;
        }

    },
    updated() {
        this.scrollDown()
    },
    beforeDestroy() {
        this.socket.close();
    }
}
</script>

<style scoped>
.serverLogBox {
    height: 350px;
    width: 100%;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    padding: 5px;
    line-height: 20px;

}
</style>
<style>
.el-scrollbar__wrap {
    overflow-x: hidden !important;
}
</style>