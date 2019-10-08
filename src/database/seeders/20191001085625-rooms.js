/* eslint-disable no-unused-vars */
/**
 * @func up
 * @param {*} queryInterface
 * @param {*} Sequelize
 * @return {func} bulkInsert
 */
export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Rooms', [{
    accommodation_id: 1,
    name: 'Room1',
    room_type: 'single',
    description: 'This is a very good room',
    cost: 200,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 1,
    name: 'Room2',
    room_type: 'double',
    description: 'This is a very good room',
    cost: 400,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 1,
    name: 'Room3',
    room_type: 'studio',
    description: 'This is a very good room',
    cost: 100,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 2,
    name: 'Room1',
    room_type: 'single',
    description: 'This is a very good room',
    cost: 200,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 2,
    name: 'Room2',
    room_type: 'double',
    description: 'This is a very good room',
    cost: 400,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 2,
    name: 'Room3',
    room_type: 'studio',
    description: 'This is a very good room',
    cost: 100,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 1,
    name: 'Room4',
    room_type: 'Random',
    description: 'This is a very good room',
    cost: 500,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    accommodation_id: 2,
    name: 'Room4',
    room_type: 'Random',
    description: 'This is a very good room',
    cost: 500,
    status: true,
    images: '[{"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628696/luxvju7a9rxarnsyrhwo.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628699/gqfczqwgjj33sdv2bmq0.jpg"}, {"image_url": "http://res.cloudinary.com/technites/image/upload/v1570628701/krlafnosukdnrp3ic8nb.jpg"}]',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
}
/**
 * @func down
 * @param {*} queryInterface
 * @param {*} Sequelize
 * @returns {func} bulkDelete
 */
export function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Rooms', null, {});
}
