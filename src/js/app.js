import Vue from 'vue'
// Ajax通信ライブラリ
import axios from 'axios';
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)



var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: '何か聞きたいことがあれば僕の答えられる範囲で答えるよ！'
  },
  watch: {
    // この関数は question が変わるごとに実行されます。
    question: function (newQuestion, oldQuestion) {
      this.answer = 'あなたが質問を打ち終わるのをまっています...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // _.debounce は特にコストの高い処理の実行を制御するための
    // lodash の関数です。この場合は、どのくらい頻繁に yesno.wtf/api
    // へのアクセスすべきかを制限するために、ユーザーの入力が完全に
    // 終わるのを待ってから ajax リクエストを実行しています。
    // _.debounce (とその親戚である _.throttle )  についての詳細は
    // https://lodash.com/docs#debounce を見てください。
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer: function () {
      if (this.question.indexOf('？') === -1) {
        this.answer = '質問するときは「？(全角)」を忘れずにつけよう！'
        return
      }
      this.answer = '回答を考えています...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'エラーです! APIに届いていません ' + error
        })
    }
  }
})

// 多くの場合では算出プロパティの方が適切ではありますが、カスタムウォッチャが必要な時もあるでしょう。
// データの変更に対して反応する、より汎用的な watch オプションを Vue が提供しているのはそのためです。
// データが変わるのに応じて非同期やコストの高い処理を実行したいときに最も便利です。
// この場合では、watch オプションを利用することで、非同期処理( API のアクセス)の実行や、
// 処理をどのくらいの頻度で実行するかを制御したり、最終的な answer が取得できるまでは中間の状態にしておく、といったことが可能になっています。
// これらはいずれも算出プロパティでは実現できません。
// watch オプションに加えて、命令的な vm.$watch API を利用することもできます。