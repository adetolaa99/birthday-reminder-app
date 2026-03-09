document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("birthdayForm");
  const submitBtn = form.querySelector('input[type="submit"]');
  const dobInput = document.getElementById("dob");

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  dobInput.setAttribute("max", todayString);

  dobInput.addEventListener("change", function () {
    const selectedDate = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      this.setCustomValidity("Please select a date that is earlier");
      showError("Please select a date that is earlier");
    } else {
      this.setCustomValidity("");
      const existingErrors = form.querySelectorAll(".error-message");
      existingErrors.forEach((msg) => msg.remove());
    }
  });

  function validateForm(data) {
    const errors = [];

    if (!data.name.trim()) {
      errors.push("Name is required");
    } else if (data.name.trim().length < 1 || data.name.trim().length > 100) {
      errors.push("Name must be between 1 and 100 characters");
    }

    if (!data.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.dob) {
      errors.push("Date of birth is required");
    } else {
      const dobDate = new Date(data.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dobDate > today) {
        errors.push("Date of birth cannot be in the future!");
      }
    }

    return errors;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.value = isLoading ? "Submitting..." : "Submit";

    if (isLoading) {
      submitBtn.style.backgroundColor = "#ccc";
    } else {
      submitBtn.style.backgroundColor = "#cc0052";
    }
  }

  function showSuccess(message) {
    const existingMessages = form.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    form.appendChild(successDiv);

    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
  }

  function showError(message) {
    const existingMessages = form.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    form.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    const existingMessages = form.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
      showError(validationErrors[0]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        showSuccess(
          "You've successfully joined our Birthday Club! 🎉 Remember to check your mail :)"
        );
        e.target.reset();
      } else {
        let errorMessage = "An error occurred... Please try again!";

        try {
          const result = await response.json();
          errorMessage = result.error || errorMessage;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
        }

        showError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("A network error occured... Please try again!");
    } finally {
      setLoading(false);
    }
  });
});
