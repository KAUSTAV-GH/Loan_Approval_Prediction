from sklearn.calibration import CalibratedClassifierCV

from model_factory import create_models


def create_calibrated_models():

    base_models = create_models()

    calibrated_models = {}

    for name, model in base_models.items():

        calibrated_models[name] = CalibratedClassifierCV(
            estimator=model,
            method="sigmoid",
            cv=5
        )

    return calibrated_models