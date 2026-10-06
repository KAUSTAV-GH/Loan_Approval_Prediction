import joblib

def load_model():

    model = joblib.load("models/loan_model.pkl")

    print("Model loaded successfully!")

    return model
