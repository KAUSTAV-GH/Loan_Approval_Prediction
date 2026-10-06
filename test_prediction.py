from prediction_service import predict_loan


applicant = {

    "Gender": "Male",

    "Married": "Yes",

    "Dependents": "0",

    "Education": "Graduate",

    "Self_Employed": "No",

    "ApplicantIncome": 5000,

    "CoapplicantIncome": 1500,

    "LoanAmount": 200,

    "Loan_Amount_Term": 360,

    "Credit_History": 1,

    "Property_Area": "Urban"
}


result = predict_loan(
    applicant
)


print("\n----- Prediction Result -----")

print(
    "Prediction:",
    result["prediction"]
)

print(
    "Decision:",
    result["decision"]
)

print(
    "Probability:",
    result["probability"]
)

print(
    "Threshold:",
    result["threshold"]
)


print("\n----- SHAP Explanation -----")

for item in result["explanation"]:

    print(
        item["feature"],
        "→",
        item["shap_value"]
    )