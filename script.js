$(window).on("load", function () {
  var divValue = $('td[title="Review"]').next("td").find("div").text();

  var cleanedValue = divValue.replace(/[^580><\-%]/g, "");

  if (cleanedValue === "<50%") {
    $('td[title="Review"]').next("td").css("color", "red");
  } else if (cleanedValue === "50-80%") {
    $('td[title="Review"]').next("td").css("color", "orange");
  } else if (cleanedValue === ">80%") {
    $('td[title="Review"]').next("td").css("color", "green");
  }

  $(document).on("click", "td.textSummaryData.requirementTd", function () {
    var $anchor = $("a[data-id]");

    var dataIdValue = $anchor.attr("data-id").toString();

    if (dataIdValue) {
      console.log("yes");
    } else {
      console.log("no");
    }
  });

  function disableButton($button) {
    $button.prop("disabled", true);
    $button.text("Reviewing...");
  }

  function enableButton($button, originalText) {
    $button.prop("disabled", false);
    $button.text(originalText);
  }

  var $trackerItemButton = $("<button>", {
    text: "Review Item",
    class: "attachButton",
    click: function () {
      event.preventDefault();
      var $button = $(this);
      var originalText = $button.text();
      disableButton($button);

      var itemId = $("#breadcrumbs-item-id").text();

      var URL =
        "https://pluginservice3.azurewebsites.net/data-evaluation-plugin-service/v1/evaluator/evaluateItem?itemId=" +
        itemId.slice(1);

      $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify({}),
        contentType: "application/json",
        success: function (response) {
          console.log("Success:", response);
          location.reload();
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Review failed!");
        },
        complete: function () {
          enableButton($button, originalText);
        },
      });
    },
  });

  var trackerPage = $("#breadcrumbs-item-id").text();

  $(".breadcrumbs-item-version").after($trackerItemButton);

  console.log("1");

  var $trackerButton = $("<button>", {
    text: "Review Tracker",
    class: "trackerButton",
    click: function (event) {
      event.preventDefault();
      var $button = $(this);
      var originalText = $button.text();
      disableButton($button);

      var trackerId = $("input[name=tracker_id]").val();

      var URL =
        "https://pluginservice3.azurewebsites.net/data-evaluation-plugin-service/v1/evaluator/evaluateTracker?trackerId=" +
        trackerId;

      $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify({}),
        contentType: "application/json",
        success: function (response) {
          console.log("Success:", response);
          location.reload();
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Review failed!");
        },
        complete: function () {
          enableButton($button, originalText);
        },
      });
    },
  });

  if (!trackerPage) {
    $(".working-set-list").before($trackerButton);
  } else {
    $(".working-set-list").before($trackerItemButton);
  }

  var proposalValue = $('td[title="Proposal"]').next("td").text();

  var cleanedProposalValue = proposalValue.replace(/\n|\t/g, "");

  var $updateDescription = $("<button>", {
    text: "Update Description",
    class: "descriptionButton",
    click: function (event) {
      event.preventDefault();

      var itemId = $("#breadcrumbs-item-id").text().slice(1);

      var origin = window.location.origin;

      var URL = `${origin}/api/v3/items/${itemId}/fields`;

      $.ajax({
        type: "PUT",
        url: URL,
        data: JSON.stringify({
          fieldValues: [
            {
              fieldId: 80,
              name: "Description",
              type: "WikiTextFieldValue",
              value: cleanedProposalValue,
            },
          ],
        }),
        contentType: "application/json",
        success: function (response) {
          console.log("Success:", response);
          location.reload();
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Review failed!");
        },
        complete: function () {
          //enableButton($button, originalText);
        },
      });
    },
  });

  $(".attachButton").before($updateDescription);
});
