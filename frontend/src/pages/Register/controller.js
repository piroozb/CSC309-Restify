const validate_form = () => {
  // function to validate form when submitted
  var username = $("#username").val();
  var email = $("#email").val();
  var phone = $("#phone").val();
  var password = $("#password1").val();
  var confirm_password = $("#password2").val();

  var username_regex = /^[a-zA-Z0-9_]{6,}$/;
  var email_regex = /^(?!.*(\.\.)|.*(@\.)|.*(\.@)|.*(@$))[\w!#$%&'*+\-/=?^`{|}~%]+(?:\.[\w!#$%&'*+\-/=?^`{|}~%]+)*@(?!.*(\.\.)|.*(_)|.*(-[^\w])|.*(\.[^\w]))(?:[\w-]+\.)+[a-zA-Z]{2,}$/;
  var phone_regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  var password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  var valid = true;

  if (!username_regex.test(username)) {
    $("#username_notification").text("Username is invalid").show();
    valid = false;
  } else {
    $("#username_notification").hide();
  }

  if (!email_regex.test(email)) {
    $("#email_notification").text("Email is invalid.").show();
    valid = false;
  } else {
    $("#email_notification").hide();
  }

  if (!phone_regex.test(phone)) {
    $("#phone_notification").text("Phone is invalid").show();
    valid = false;
  } else {
    $("#phone_notification").hide();
  }

  if (!password_regex.test(password)) {
    $("#password1_notification").text("Password is invalid").show();
    valid = false;
  } else {
    $("#password1_notification").hide();
  }

  if (confirm_password !== password) {
    $("#password2_notification").text("Passwords don't match").show();
    valid = false;
  } else {
    $("#password2_notification").hide();
  }

  if (!valid) {
    $("#notification")
      .text(
        "At least one field is invalid. Please correct it before proceeding"
      )
      .show();
  } else {
    $("#notification").hide();
    $.ajax({
      url: "/register",
      type: "POST",
      data: JSON.stringify({
        username: username,
        email: email,
        phone: phone,
        password1: password,
        password2: confirm_password,
      }),
      success: function (response) {
        if (response) {
          $("#notification").text("User added").show();
        }
      },
      error: function (response) {
        if (response.status === 400) {
          $("#notification").text("Unknown error occurred").show();
        } else if (response.status === 409) {
          $("#notification").text("Username has already been taken").show();
        }
      },
    });
  }
};

$(document).ready(function () {
  // validate username field
  $("#username").on("input", function () {
    var username = $(this).val();
    var regex = /^[a-zA-Z0-9_]{6,}$/;

    if (!regex.test(username)) {
      $("#username_notification").text("Username is invalid").show();
    } else {
      $("#username_notification").hide();
    }
  });

  // validate email field
  $("#email").on("input", function () {
    var email = $(this).val();
    var regex = /^(?!.*(\.\.)|.*(@\.)|.*(\.@)|.*(@$))[\w!#$%&'*+\-/=?^`{|}~%]+(?:\.[\w!#$%&'*+\-/=?^`{|}~%]+)*@(?!.*(\.\.)|.*(_)|.*(-[^\w])|.*(\.[^\w]))(?:[\w-]+\.)+[a-zA-Z]{2,}$/;
    ;

    if (!regex.test(email)) {
      $("#email_notification").text("Email is invalid.").show();
    } else {
      $("#email_notification").hide();
    }
  });

  // validate phone field
  $("#phone").on("input", function () {
    var phone = $(this).val();
    var regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    if (!regex.test(phone)) {
      $("#phone_notification").text("Phone is invalid").show();
    } else {
      $("#phone_notification").hide();
    }
  });

  // validate password field
  $("#password1").on("input", function () {
    var password = $(this).val();
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    if (!regex.test(password)) {
      $("#password1_notification").text("Password is invalid").show();
    } else {
      $("#password1_notification").hide();
    }
  });

  // validate confirm password field
  $("#password2").on("input", function () {
    var confirm_password = $(this).val();
    var password = $("#password1").val();

    if (confirm_password !== password) {
      $("#password2_notification").text("Passwords don't match").show();
    } else {
      $("#password2_notification").hide();
    }
  });

  // form submission for the register form

  $("#register-form").submit(function (event) {
    event.preventDefault(); // prevent the form from submitting
    validate_form();
  });

  // TASK 2
  var shoppingCart = [];

  // Function to add or update item in the shopping cart
  function addOrUpdateItem() {
    var name = $("#name").val();
    var price = parseFloat($("#price").val());
    var quantity = parseInt($("#quantity").val());

    // Validate the input values
    if (
      name.length === 0 ||
      isNaN(price)  ||
      !Number.isInteger(parseInt(quantity))
    ) {
      $("#item_notification").text("Name, price or quantity is invalid");
      return;
    } else {
      $("#item_notification").text("");
    }

    // Check if the item is already in the shopping cart
    var itemIndex = -1;
    for (var i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].name === name) {
        itemIndex = i;
        break;
      }
    }

    // If the item is already in the shopping cart, update its quantity and price
    if (itemIndex !== -1) {
      shoppingCart[itemIndex].quantity = quantity;
      shoppingCart[itemIndex].price = price;
    } else {
      // else, add the new item to the shopping cart
      var newItem = {
        name: name,
        price: price,
        quantity: quantity,
      };
      shoppingCart.push(newItem);
    }

    // Clear the input fields
    $("#name").val("");
    $("#price").val("");
    $("#quantity").val("");

    // Update the shopping cart table
    updateCartTable();
  }

  function updateCartTable() {
    $("#cart-items tbody").empty();

    var subtotal = 0;
    var taxes = 0;

    // Add the table data rows
    for (var i = 0; i < shoppingCart.length; i++) {
      var item = shoppingCart[i];
      var total = item.price * item.quantity;
      var dataRow = $(`<tr id="${item.name.replace(/\s+/g, "_")}">`).append(
        $("<td>").text(item.name.trim()),
        $("<td>").text("$" + item.price.toFixed(2)),
        $("<td>").text(item.quantity),
        $("<td>").text("$" + total.toFixed(2)),
        $("<td>").html(
          '<button class="decrease" data-item="' + i + '">-</button>'
        ),
        $("<td>").html(
          '<button class="increase" data-item="' + i + '">+</button>'
        ),
        $("<td>").html(
          '<button class="delete" data-item="' + i + '">Delete</button>'
        )
      );
      $("#cart-items tbody").append(dataRow);

      subtotal += item.price * item.quantity;
    }

    taxes = subtotal * 0.13;

    var grandTotal = subtotal + taxes;

    $("#subtotal").text(subtotal.toFixed(2));
    $("#taxes").text(taxes.toFixed(2));
    $("#grand_total").text(grandTotal.toFixed(2));

    $(".decrease").on("click", reduceItemQuantity);
    $(".increase").on("click", addItemQuantity);
    $(".delete").on("click", removeCartItem);
  }

  // Function to reduce the quantity of an item in the shopping cart
  function reduceItemQuantity() {
    var itemIndex = $(this).data("item");
    if (shoppingCart[itemIndex].quantity > 0) {
      shoppingCart[itemIndex].quantity--;
    } else {
      shoppingCart[itemIndex].quantity = 0;
    }
    updateCartTable();
  }

  // Function to add the quantity of an item in the shopping cart
  function addItemQuantity() {
    var itemIndex = $(this).data("item");
    shoppingCart[itemIndex].quantity++;
    updateCartTable();
  }

  // Function to remove an item from the shopping cart
  function removeCartItem() {
    var itemIndex = $(this).data("item");
    shoppingCart.splice(itemIndex, 1);
    updateCartTable();
  }

  $("#add_update_item").on("click", addOrUpdateItem);

  // end of task 2

  // TASK 3
  let paragraph = 1;
  let next = false;

  // Load initial data
  loadData(paragraph);

  // Add a scroll listener to check if the user has reached the bottom of the page
  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() - $(document).height() < 2) {
      if (next) {
        // Load the next page if available
        paragraph += 5;
        loadData(paragraph);
      }
    }
  });

  function loadData(paragraph) {
    $.ajax({
      url: "/text/data?paragraph=" + paragraph,
      type: "GET",
      success: function (response) {
        renderData(response.data);

        // Check if there is more data available
        if (response.next) {
          next = true;
        } else {
          next = false;
          $("#data").append(
            "<div><b>" + "You have reached the end" + "</b></div>"
          );
        }
      },
    });
  }

  function renderData(data) {
    for (var i = 0; i < data.length; i++) {
      $("#data").append(
        `<div id="paragraph_${data[i].paragraph}">` +
          `<p>${data[i].content} <b>(Paragraph ${data[i].paragraph})</b></p> <button class='like'>Likes: ${data[i].likes}</button>` +
          "</div>"
      );
    }
  }

  $(document).on("click", ".like", function () {
    var $this = $(this);

    var paragraphNumber = $this.parent().attr("id").split("_")[1];
    $.ajax({
      url: "/text/like",
      method: "POST",
      data: JSON.stringify({ paragraph: paragraphNumber }),
      success: function (response) {
        // Update the button's text to show the new number of likes
        $this.text("Likes: " + response.data.likes);
      },
    });
  });
});
