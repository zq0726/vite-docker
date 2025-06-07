<script setup lang="ts">
import type { ResultData } from '@/utils/http/types'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { getImagePath } from '@/utils/public'
import type { UserInfo } from '@/api/user/type'
import { userAddApi } from '@/api/user'

interface ShowPrams {
  isUpdata?: boolean
  showFooter?: boolean
  params?: any
  width?: string
}

interface RuleForm extends Partial<UserInfo> {
  confirmPassword?: string
  password: string
}

const emit = defineEmits(['success'])

const labelWidth = '100px'
const uploadAddress = import.meta.env.VITE_API + '/api' + import.meta.env.VITE_UPLOAD_ADDRESS
const title = ref<string>('用户新增')
const visible = ref(false)
const showFooter = ref<boolean>(true)
const modelWidth = ref<string>('50%')
const formRef = ref<FormInstance>()
const isSubmit = ref<boolean>(false)
// 密码验证
const confirmPwd = (rule: any, value: any, callback: any) => {
  if (value !== ruleForm.password) {
    callback(new Error('两次密码不一样'))
  }
  callback()
}
const rules = reactive<FormRules>({
  account: { required: true, message: '请输入用户账号', trigger: 'blur' },
  password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: confirmPwd,
      trigger: 'blur',
    },
  ],
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  phone: { required: true, message: '请输入手机号', trigger: 'blur' },
  role: { required: true, message: '请选择角色', trigger: 'change' },
})

const ruleForm = reactive<RuleForm>({
  account: '',
  password: '',
  confirmPassword: '',
  username: '',
  phone: '',
  avatar: '',
  email: '',
  role: '',
})

/**
 * 显示model
 * @param { ShowPrams } params
 */
const showModel = (params: ShowPrams) => {
  visible.value = true

  const { isUpdata } = params
  if (isUpdata) title.value = '修改用户'
  else title.value = '新增用户'

  showFooter.value = params.showFooter ?? true
  if (params.width) modelWidth.value = params.width
}

/**
 * 上传的回调
 */
const uploadSuccess = (info: ResultData<{ path: string }>) => {
  console.log('info', info)
  const {
    data: { path },
  } = info

  ruleForm.avatar = path
}

/**
 * 提交
 */
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const validate = await formRef.value?.validate()

  try {
    if (validate) {
      isSubmit.value = true
      const res = await userAddApi(ruleForm)
      ElMessage.success(res as string)
      formEl.resetFields()
      visible.value = false
      emit('success')
    }
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    isSubmit.value = false
  }
}

defineExpose({
  showModel,
})
</script>

<template>
  <el-dialog v-model="visible" :title="title" :width="modelWidth">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" :label-width="labelWidth" status-icon>
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm.account" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" show-password clearable />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="ruleForm.confirmPassword" type="password" show-password clearable />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" clearable />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload :show-file-list="false" :action="uploadAddress" :on-success="uploadSuccess">
          <img v-if="ruleForm.avatar" :src="getImagePath(ruleForm.avatar)" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="角色" prop="region">
        <el-select v-model="ruleForm.role" placeholder="请选择角色" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer v-if="showFooter">
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="isSubmit" type="primary" @click="submit(formRef)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
$imgSize: 120px;

.avatar {
  width: $imgSize;
  height: $imgSize;
  object-fit: cover;
  display: block;
}
:deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: $imgSize;
  height: $imgSize;
  text-align: center;
}
</style>
