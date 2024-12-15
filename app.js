document
  .getElementById("priceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Kullanıcıdan verileri al
    const gamePrice = parseFloat(document.getElementById("gamePrice").value);
    const playerCount = parseInt(document.getElementById("playerCount").value);

    // Girdileri kontrol et
    if (
      isNaN(gamePrice) ||
      isNaN(playerCount) ||
      gamePrice <= 0 ||
      playerCount <= 1
    ) {
      document.getElementById("result").innerHTML =
        "Lütfen geçerli değerler girin!";
      return;
    }

    // Döviz kuru API'sinden USD/TRY kurunu al
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        const usdToTryRate = data.rates.TRY;

        // Yuvarlama fonksiyonu
        const roundToTwo = (num) =>
          Math.round((num + Number.EPSILON) * 100) / 100;

        // Hesaplama
        const specialPayingPlayerShareUSD = roundToTwo(
          (2 / (playerCount + 1)) * gamePrice
        );
        const otherPlayersShareUSD = roundToTwo(
          (1 / (playerCount + 1)) * gamePrice
        );

        const specialPayingPlayerShareTRY = roundToTwo(
          specialPayingPlayerShareUSD * usdToTryRate
        );
        const otherPlayersShareTRY = roundToTwo(
          otherPlayersShareUSD * usdToTryRate
        );

        // Sonuçları göster
        let resultHtml = `
          <p><strong>Ödeme Dağılımı:</strong></p>
          <p>Özel ödeyen kişi: $${specialPayingPlayerShareUSD} / ₺${specialPayingPlayerShareTRY}</p>
        `;

        for (let i = 1; i < playerCount; i++) {
          resultHtml += `<p>Kişi ${
            i + 1
          }: $${otherPlayersShareUSD} / ₺${otherPlayersShareTRY}</p>`;
        }

        document.getElementById("result").innerHTML = resultHtml;
      })
      .catch((error) => {
        console.error("Döviz kuru alınırken bir hata oluştu:", error);
        document.getElementById("result").innerHTML =
          "Döviz kuru alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      });
  });
