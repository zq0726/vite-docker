<script setup lang="ts">
import type { LoginForm } from '@/api/login/type'
import { ref, reactive, onUnmounted, computed } from 'vue'
import { captchaApi, loginApi } from '@/api/login/index'
import { Lock, UserFilled } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { Storage } from '@/utils/storage'
import { TOKEN } from '@/config/constant'
import { useRouter } from 'vue-router'
import errImage from '@/assets/image/noCaptcha.png'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const { platform } = storeToRefs(useLayout())

const router = useRouter()

const formRef = ref()
const captchaImg = ref<string>('')
const form = reactive<LoginForm>({
  account: '',
  password: '',
  captcha: '',
})
const isLoading = ref<boolean>(false)

// 获取验证码
const getCaptcha = debounce(async () => {
  const { img } = await captchaApi()
  const blob = new Blob([img], { type: 'image/svg+xml' })
  captchaImg.value = URL.createObjectURL(blob)
}, 1000)

// 登录
const handleLogin = async () => {
  try {
    if (!form.account) return ElMessage.error('账号不能为空')
    if (!form.password) return ElMessage.error('密码不能为空')
    if (!form.captcha) return ElMessage.error('验证码不能为空')

    isLoading.value = true
    const { token } = await loginApi(form)
    Storage.set(TOKEN, token)
    formRef.value.resetFields()

    router.push({
      path: '/home',
    })
  } catch (error: any) {
    const { code, message } = error
    switch (code) {
      case 10004:
        getCaptcha()
        ElMessage.error(message)
        break
      case 400:
        ElMessage.error(message)
        break
      case 10002:
        ElMessage.error(message)
        break
      default:
        ElMessage.error('有问题')
        break
    }
  } finally {
    isLoading.value = false
  }
}

// 配置 class
const getClass = computed(() => {
  switch (platform.value) {
    case 'mobile':
      return 'mobile'
    case 'desktop':
      return 'desktop'
    case 'tablet':
      return 'tablet'
    case 'large-desktop':
      return 'large-desktop'
    default:
      return 'tablet'
  }
})

onUnmounted(() => {
  if (captchaImg.value) {
    URL.revokeObjectURL(captchaImg.value)
  }
})

getCaptcha()
</script>

<template>
  <div class="login">
    <div class="login-main" :class="getClass">
      <h2>登录</h2>
      <el-form ref="formRef" :model="form" size="large">
        <el-form-item prop="account">
          <el-input v-model="form.account" :prefix-icon="Lock" placeholder="账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            :prefix-icon="UserFilled"
            v-model="form.password"
            placeholder="密码"
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha-box">
            <el-input class="captcha" v-model="form.captcha" placeholder="验证码" />
            <img
              @click="getCaptcha"
              :src="captchaImg ? captchaImg : errImage"
              alt="图片不存在"
              srcset=""
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isLoading" style="width: 100%" type="primary" @click="handleLogin"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/image/bg.png');
  background-repeat: no-repeat;
  background-size: cover;

  &-main {
    padding: 20px 40px;
    border-radius: 10px;
    min-width: 450px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.5);

    h2 {
      text-align: center;
      line-height: 40px;
      font-size: 30px;
      margin: 20px 0;
      color: white;
    }

    .captcha-box {
      width: 100%;
      display: flex;

      .captcha {
        flex: 1;
        margin-right: 10px;
      }
      img {
        height: 40px;
        width: 100px;
      }
    }
  }

  .mobile {
    padding: 0 20px !important;
    min-width: 375px;
    width: 100%;
    box-shadow: none;
  }

  // @media (max-width: 768px) {
  //   &-main {
  //     padding: 0 20px !important;
  //     min-width: 375px;
  //     width: 100%;
  //     box-shadow: none;
  //   }
  // }
}
</style>
