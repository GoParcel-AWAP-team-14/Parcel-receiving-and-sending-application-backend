const Parcel = require("../models/Parcel");

async function findParcels(req, res, next) {
  try {
    const status = req.header("status");
    const mobile = req.header("mobile");
    if (status) {
      const response = await Parcel.find({ status: status });
      if (response.length > 0) {
        res.status(200).json({
          response: response,
          success: true,
        });
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "No parcels found!",
            },
          },
          success: false,
        });
      }
    }
    if (mobile) {
      const response = await Parcel.find({
        $or: [{ "sender.mobile": mobile }, { "recipient.mobile": mobile }],
      });
      const senderParcels = await Parcel.find({ "sender.mobile": mobile });

      if (senderParcels.length > 0) {
        // The mobile number matches either a sender or recipient
        res.status(200).json({
          response: response,
          success: true,
          isSender: senderParcels.length > 0,
        });
      } else if (response.length > 0) {
        res.status(200).json({
          response: response,
          success: true,
        });
      } else {
        res.status(404).json({
          errors: {
            common: {
              msg: "No parcels found!",
            },
          },
          success: false,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
      success: false,
    });
  }
}

module.exports = {
  findParcels,
};
