import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { createCategoryDto } from './dto/create.category.dto';
import { updateCategoryDto } from './dto';
import { JwtGuard } from '../auth/Guards';
import { AdminGuard } from '../auth/Guards/auth.guard';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getAllCategory: jest.fn(),
            findCategory: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategory', () => {
    it('should call service.getAllCategory and return categories', async () => {
      const result = [{ id: '1', type: 'Bike' }];
      jest.spyOn(service, 'getAllCategory').mockResolvedValue(result);

      expect(await controller.getAllCategory(1)).toBe(result);
      expect(service.getAllCategory).toHaveBeenCalledWith(1);
    });
  });

  describe('findCategory', () => {
    it('should call service.findCategory and return matching categories', async () => {
      const result = [{ id: '1', type: 'Bike' }];
      jest.spyOn(service, 'findCategory').mockResolvedValue(result);

      expect(await controller.findCategory('Bike')).toBe(result);
      expect(service.findCategory).toHaveBeenCalledWith('Bike');
    });
  });

  describe('createCategory', () => {
    it('should call service.createCategory and return created category', async () => {
      const dto: createCategoryDto = { type: 'New Type', picsCategory: 'url' };
      const result = { message: 'Category created successfully' };
      jest.spyOn(service, 'createCategory').mockResolvedValue(result);

      expect(await controller.createCategory(dto)).toBe(result);
      expect(service.createCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateCategory', () => {
    it('should call service.updateCategory and return updated message', async () => {
      const dto: updateCategoryDto = {
        type: 'Updated Type',
        picsCategory: 'updated-url',
      };
      const result = { message: 'Category updated successfully' };
      jest.spyOn(service, 'updateCategory').mockResolvedValue(result);

      expect(await controller.updateCategory('1', dto)).toBe(result);
      expect(service.updateCategory).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('deleteCategory', () => {
    it('should call service.deleteCategory and return delete confirmation', async () => {
      const result = { message: 'Category deleted successfully' };
      jest.spyOn(service, 'deleteCategory').mockResolvedValue(result);

      expect(await controller.deleteCategory('1')).toBe(result);
      expect(service.deleteCategory).toHaveBeenCalledWith('1');
    });
  });
});
