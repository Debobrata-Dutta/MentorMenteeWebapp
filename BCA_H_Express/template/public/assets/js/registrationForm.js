document.getElementById("agree").addEventListener("change", function() {
    document.getElementById("submitButton").disabled = !this.checked;
});