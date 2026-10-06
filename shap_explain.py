import shap
import pandas as pd


def explain_prediction(
    model,
    X_train,
    X_sample
):
    """
    Generate human-friendly SHAP explanations
    for a prediction.
    """

    # Get preprocessing pipeline
    preprocessor = model.named_steps["preprocessor"]

    # Get trained classifier
    classifier = model.named_steps["classifier"]

    # Transform training data
    X_train_transformed = preprocessor.transform(
        X_train
    )

    # Transform sample data
    X_sample_transformed = preprocessor.transform(
        X_sample
    )

    # Get transformed feature names
    feature_names = (
        preprocessor.get_feature_names_out()
    )

    # Create SHAP explainer
    explainer = shap.LinearExplainer(
        classifier,
        X_train_transformed
    )

    # Calculate SHAP values
    shap_values = explainer(
        X_sample_transformed
    )

    # Get SHAP values for first sample
    values = shap_values.values[0]

    # Create dataframe
    explanation = pd.DataFrame({
        "feature": feature_names,
        "shap_value": values
    })

    # Convert transformed feature names
    # back to original feature names
    def get_original_feature(name):

        # Remove transformer prefix
        if "__" in name:
            name = name.split(
                "__",
                1
            )[1]

        # Handle one-hot encoded categorical features
        categorical_features = [
            "Gender",
            "Married",
            "Dependents",
            "Education",
            "Self_Employed",
            "Property_Area"
        ]

        for feature in categorical_features:

            if name.startswith(
                feature + "_"
            ):
                return feature

        return name

    explanation["original_feature"] = (
        explanation["feature"].apply(
            get_original_feature
        )
    )

    # Group one-hot encoded features
    grouped = (
        explanation
        .groupby("original_feature")[
            "shap_value"
        ]
        .sum()
        .reset_index()
    )

    # Rename columns
    grouped = grouped.rename(
        columns={
            "original_feature": "feature"
        }
    )

    # Calculate absolute contribution
    grouped["absolute_shap"] = (
        grouped["shap_value"].abs()
    )

    # Sort by importance
    grouped = grouped.sort_values(
        "absolute_shap",
        ascending=False
    )

    return grouped