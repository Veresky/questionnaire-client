
module.exports = function(app) {
  app.get("/mockApi/current/detail", (req, res) => {
    res.json({
      returncode: "00000",
      message: "OK",
      data: {
        url: "/mockApi/current/detail",
        msg: "mock【当前类】详情接口调用成功",
      },
    })
  })
}
