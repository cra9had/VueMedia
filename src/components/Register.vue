<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-12 col-lg-9 col-xl-7">
          <div class="card shadow-2-strong card-registration" style="border-radius: 15px;">
            <div class="card-body p-4 p-md-5">
              <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
                <div class="row">
                  <div class="col-md-12 mb-4">

                    <div class="form-outline">
                      <label class="form-label" for="fullname">ФИО</label>
                      <input type="text" id="fullname" class="form-control form-control-lg" />
                      <div class="invalid-feedback" id="fullnameError">
                      </div>
                    </div>

                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4 d-flex align-items-center">

                    <div class="form-outline datepicker w-100">
                      <label for="birthdayDate" class="form-label">Дата рождения</label>
                      <input
                        type="date"
                        class="form-control form-control-lg"
                        id="birthdayDate"
                      />
                    </div>
                    <div class="invalid-feedback" id="birthdayError">
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">

                    <h6 class="mb-2 pb-1">Пол: </h6>

                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="maleGender"
                        value="Мужской"
                        checked
                      />
                      <label class="form-check-label" for="femaleGender">Мужской</label>
                    </div>

                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="femaleGender"
                        value="Женский"
                      />
                      <label class="form-check-label" for="maleGender">Женский</label>
                    </div>

                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4 pb-2">

                    <div class="form-outline">
                      <label class="form-label" for="email">Почта</label>
                      <input type="email" id="email" class="form-control form-control-lg" />
                    </div>
                    <div class="invalid-feedback" id="emailError">
                    </div>

                  </div>
                  <div class="col-md-6 mb-4 pb-2">

                    <div class="form-outline">
                      <label class="form-label" for="password">Пароль</label>
                      <input type="password" id="password" class="form-control form-control-lg" />
                    </div>
                    <div class="invalid-feedback" id="passwordError">
                    </div>

                  </div>
                </div>

                <div class="mt-8 pt-2">
                  <input class="btn btn-primary btn-lg" type="submit" value="Зарегистрироваться" v-on:click="Register" />
                  <a v-on:click="goLoginPage" class="mx-4">Уже есть аккаунт?</a>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Register',
  methods: {
    goLoginPage () {
      this.$router.push({ name: 'LoginPage' })
    },

    async checkToken () {
      if (!localStorage.token) {
        return false
      }
      const response = await fetch(this.$api_host + 'account/check/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.token
        })
      })
      return await response.status === 200
    },

    async Register () {
      console.log(await this.checkToken())
      if (await this.checkToken()) {
        alert('Вы уже вошли в акканут')
        return
      }
      const fullname = document.getElementById('fullname').value
      const birthday = document.getElementById('birthdayDate').value
      let gender = 'М'
      if (document.getElementById('femaleGender').checked) {
        gender = 'Ж'
      }
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      const response = await fetch(this.$api_host + 'account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullname: fullname,
          birthday: birthday,
          sex: gender,
          email: email,
          password: password
        })
      })
      if (await response.status === 200) {
        alert('Подтвердите вашу почту')
        this.goLoginPage()
      } else {
        const responseJson = await response.json()
        Object.keys(responseJson).forEach(function (key, index) {
          console.log(key)
          document.getElementById(key + 'Error').innerText = responseJson[key][0]
        })
      }
    }
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: flex;
}

.gradient-custom {
  background: #f093fb;

  background: -webkit-linear-gradient(to bottom right, rgba(240, 147, 251, 1), rgba(245, 87, 108, 1));

  background: linear-gradient(to bottom right, rgba(240, 147, 251, 1), rgba(245, 87, 108, 1))
}

.card-registration .select-input.form-control[readonly]:not([disabled]) {
  font-size: 1rem;
  line-height: 2.15;
  padding-left: .75em;
  padding-right: .75em;
}
.card-registration .select-arrow {
  top: 13px;
}
</style>
