import joblib
import pandas as pd

from preprocessing import load_data
from split_data import split_data

from shap_explain import explain_prediction


MODEL_PATH = "models/loan_model.pkl"

FINAL_THRESHOLD = 0.32


model = joblib.load(
    MODEL_PATH
)


def load_training_features():

    df = load_data()

    X_train, X_test, y_train, y_test = split_data(
        df
    )

    return X_train


X_TRAIN = load_training_features()


def predict_loan(applicant_data):

    applicant_df = pd.DataFrame(
        [applicant_data]
    )

    probability = model.predict_proba(
        applicant_df
    )[0, 1]

    prediction = int(
        probability >= FINAL_THRESHOLD
    )

    if prediction == 1:
        decision = "Approved"
    else:
        decision = "Not Approved"

    shap_results = explain_prediction(
        model,
        X_TRAIN,
        applicant_df
    )

    return {
        "prediction": prediction,
        "decision": decision,
        "probability": float(probability),
        "threshold": FINAL_THRESHOLD,
        "explanation": (
            shap_results.to_dict(
                orient="records"
            )
        )
    }