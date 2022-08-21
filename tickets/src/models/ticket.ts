import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// Interface that describes the props that are required to create a USER
interface TicketAttrs {
  title: string
  price: number
  userId: string
}

// Interface that describes the props that a USER model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

// Interface that describes the props that a USER document has
interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
    // versionKey: false,
  }
)

ticketSchema.set('versionKey', 'version')

ticketSchema.plugin(updateIfCurrentPlugin)
// ticketSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   }
//
//   done()
// })

// ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
//   return Ticket.findOne({ _id: event.id, version: event.version - 1 })
// }

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
