class FieldRequestValidationUtil:
    """
    Field not empty validator
    """
    @staticmethod
    def mandatory_field(data):
        """
        Checks if the requested field is empty or not
        :param data: request field data
        :return: if the field data is missing
        """
        for fn in data.keys():
            if data[str(fn)] == '':
                dict_response = {
                    'error': True,
                    'message': f'{fn} is required'
                }
                return dict_response
